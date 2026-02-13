// @ts-check
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { softDeleteVendorItem } from '@/features/vendor/api';
import { useVendorDetail } from '@/features/vendor/hooks/use-vendor-detail'; // 이미 쓰고 있는 상세 훅
import { useUpdateVendor } from '@/features/vendor/hooks/use-update-vendor';
import { useItemsSearch } from '@/features/vendor/hooks/use-items-search';

/**
 * @typedef {'Supplier'|'Seller'} VendorType
 *
 * @typedef {object} SelectedItem
 * @property {number} itemId
 * @property {string} itemName
 * @property {number} unitPrice
 *
 * @typedef {object} VendorModifyForm
 * @property {VendorType} type
 * @property {string} 거래처명
 * @property {string} 전화번호
 * @property {string} 이메일
 * @property {string} 주소
 * @property {string} 메모
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(01[0-9]-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/;



function normalizePhone(value) {
  const digits = value.replace(/[^\d]/g, '');

  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export function VendorModifyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const vendorId = Number(id);

  const { data, isLoading, error } = useVendorDetail(vendorId);
  const vendor = data?.vendor;
  const vendorItems = data?.items ?? [];

  const { mutateAsync: updateVendorMutate, isPending: updating } = useUpdateVendor();

  /** @type {[VendorModifyForm, Function]} */
  const [form, setForm] = useState({
    type: /** @type {VendorType} */ ('Seller'),
    거래처명: '',
    전화번호: '',
    이메일: '',
    주소: '',
    메모: '',
  });

  const [touched, setTouched] = useState({
    거래처명: false,
    전화번호: false,
    이메일: false,
    주소: false,
  });

  const [itemKeyword, setItemKeyword] = useState('');
  const [selectedItems, setSelectedItems] = useState(/** @type {SelectedItem[]} */ ([]));

  // 최초 로딩 시: 기존 vendor 데이터로 폼 자동 채우기 + 공급처면 품목/단가도 채우기
  useEffect(() => {
    if (!vendor) return;

    setForm({
      type: vendor.type, // 'Supplier'|'Seller'
      거래처명: vendor.vendorName ?? '',
      전화번호: vendor.telephone ?? '',
      이메일: vendor.email ?? '',
      주소: vendor.address ?? '',
      메모: vendor.memo ?? '',
    });

    if (vendor.type === 'Supplier') {
      setSelectedItems(
        vendorItems.map((it) => ({
          itemId: it.productId,
          itemName: it.productName,
          unitPrice: Number(it.purchasePrice ?? 0),
        }))
      );
    } else {
      setSelectedItems([]);
    }
  }, [vendor, vendorItems]);

  // 품목 검색 (이미 다른 거래처에 지정된 품목 제외)
  const { data: itemsData, isFetching: itemsLoading } = useItemsSearch({
    keyword: itemKeyword.trim(),
    excludeAssigned: true,
    currentVendorId: vendorId,
  });

  const items = /** @type {{ id: number, name: string }[]} */ (itemsData ?? []);

  // 검색 결과에서 이미 선택한 품목 제외
  const filteredItems = useMemo(() => {
    const selectedSet = new Set(selectedItems.map((x) => x.itemId));
    return items.filter((it) => !selectedSet.has(it.id));
  }, [items, selectedItems]);

  const setField = (key) => (e) => {
    let value = e.target.value;
    if (key === '전화번호') value = normalizePhone(value);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /** @param {VendorType} type */
  const setType = (type) => {
    setForm((prev) => ({ ...prev, type }));
    if (type === 'Seller') {
      // 판매처면 품목 영역 숨김 + 상태 초기화
      setItemKeyword('');
      setSelectedItems([]);
    }
  };

  const markTouched = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  // 필수값 검증
  const errors = useMemo(() => {
    /** @type {Record<string, string | undefined>} */
    const e = {};

    const name = form.거래처명.trim();
    const phone = form.전화번호.trim();
    const email = form.이메일.trim();
    const addr = form.주소.trim();

    if (!name) e.거래처명 = '미입력되었습니다';

    if (!phone) e.전화번호 = '미입력되었습니다';
    else if (!phoneRegex.test(phone)) e.전화번호 = '전화번호 양식이 올바르지 않습니다 (예: 010-1234-5678)';

    if (!email) e.이메일 = '미입력되었습니다';
    else if (!emailRegex.test(email)) e.이메일 = '이메일 양식이 올바르지 않습니다';

    if (!addr) e.주소 = '미입력되었습니다';

    return e;
  }, [form]);

  const isValidRequired = useMemo(() => {
    return !errors.거래처명 && !errors.전화번호 && !errors.이메일 && !errors.주소;
  }, [errors]);

  // 공급처일 때: 품목 1개 이상 + 단가 모두 > 0
  const isValidSupplierItems = useMemo(() => {
    if (form.type !== 'Supplier') return true;
    if (selectedItems.length < 1) return false;
    return selectedItems.every((x) => Number(x.unitPrice) > 0);
  }, [form.type, selectedItems]);


  // 완료 버튼 활성 조건
  const canSubmit = isValidRequired && isValidSupplierItems && !updating;

  const onSelectItem = (it) => {
    setSelectedItems((prev) => [...prev, { itemId: it.id, itemName: it.name, unitPrice: 0 }]);
    setItemKeyword('');
  };

  const onChangeUnitPrice = (itemId) => (e) => {
    const v = e.target.value.replace(/[^\d]/g, '');
    const num = v ? Number(v) : 0;
    setSelectedItems((prev) => prev.map((x) => (x.itemId === itemId ? { ...x, unitPrice: num } : x)));
  };

  // const onRemoveItem = (itemId) => {
  //   setSelectedItems((prev) => prev.filter((x) => x.itemId !== itemId));
  // };

  const onRemoveItem = async (itemId) => {
  try {
    await softDeleteVendorItem({ vendorId, productId: itemId });
    setSelectedItems((prev) => prev.filter((x) => x.itemId !== itemId));
    queryClient.invalidateQueries({ queryKey: ['items-search'] }); 
  } catch (e) {
    console.error(e);
    alert('품목 삭제 중 오류가 발생했습니다.');
  }
};

  const onSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      거래처명: true,
      전화번호: true,
      이메일: true,
      주소: true,
    });

    
    if (!isValidRequired) {
      alert('미입력되었습니다');
      return;
    }
    if (form.type === 'Supplier' && !isValidSupplierItems) {
      alert('공급처는 품목 1개 이상 등록하고 단가를 모두 입력해야 합니다.');
      return;
    }
    if (!Number.isFinite(vendorId)) {
      alert('잘못된 거래처 ID입니다.');
      return;
    }

    /** @type {any} */
    const payload = {
      type: form.type, // Supplier|Seller
      vendorName: form.거래처명.trim(),
      telephone: form.전화번호.trim(),
      email: form.이메일.trim(),
      address: form.주소.trim(),
      memo: form.메모?.trim() || null,

      
      bossName: vendor?.bossName ?? null,

      items: form.type === 'Supplier'
        ? selectedItems.map((x) => ({
            productId: x.itemId,
            purchasePrice: x.unitPrice,
          }))
        : [],
    };

    try {
  await updateVendorMutate({ id: vendorId, payload });

  alert('수정되었습니다');
  navigate(`/dashboard/vendor/${vendorId}`); // ✅ 상세로 이동
} catch (err) {
  console.error('updateVendor failed:', err);
  alert(err?.message ?? '수정 중 오류가 발생했습니다.');
}
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'crimson' }}>에러: {error.message}</div>;
  if (!vendor) return <div>거래처 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h1>거래처 수정</h1>

      <form onSubmit={onSubmit}>
        {/* 공급처/판매처 라디오 */}
        <div>
  <span>구분</span>
  <br />

  {form.type === 'Supplier' ? (
    <label>
      <input type="radio" name="vendorType" checked readOnly />
      공급처
    </label>
  ) : (
    <label>
      <input type="radio" name="vendorType" checked readOnly />
      판매처
    </label>
  )}
</div>

        {/* 거래처명 */}
        <div>
          <div>
            <span>거래처명 *</span>
            {touched.거래처명 && errors.거래처명 ? (
              <span style={{ color: 'crimson', marginLeft: 8 }}>{errors.거래처명}</span>
            ) : null}
          </div>
          <Input value={form.거래처명} onChange={setField('거래처명')} onBlur={markTouched('거래처명')} />
        </div>

        {/* 전화번호 */}
        <div>
          <div>
            <span>전화번호 *</span>
            {touched.전화번호 && errors.전화번호 ? (
              <span style={{ color: 'crimson', marginLeft: 8 }}>{errors.전화번호}</span>
            ) : null}
          </div>
          <Input
            value={form.전화번호}
            onChange={setField('전화번호')}
            onBlur={markTouched('전화번호')}
            placeholder="010-1234-5678"
            inputMode="numeric"
          />
        </div>

        {/* 이메일 */}
        <div>
          <div>
            <span>이메일 *</span>
            {touched.이메일 && errors.이메일 ? (
              <span style={{ color: 'crimson', marginLeft: 8 }}>{errors.이메일}</span>
            ) : null}
          </div>
          <Input
            value={form.이메일}
            onChange={setField('이메일')}
            onBlur={markTouched('이메일')}
            placeholder="1234@gmail.com"
          />
        </div>

        {/* 주소 */}
        <div>
          <div>
            <span>주소 *</span>
            {touched.주소 && errors.주소 ? (
              <span style={{ color: 'crimson', marginLeft: 8 }}>{errors.주소}</span>
            ) : null}
          </div>
          <Input value={form.주소} onChange={setField('주소')} onBlur={markTouched('주소')} />
        </div>

        {/* 메모 */}
        <div>
          <span>메모</span>
          <Input value={form.메모} onChange={setField('메모')} />
        </div>

        {/* 공급처일 때만 품목/단가 */}
        {form.type === 'Supplier' ? (
          <div style={{ marginTop: 12 }}>
            <span style={{ fontWeight: 600 }}>품목 검색</span>

            <div style={{ position: 'relative', marginTop: 8 }}>
              <Input
                value={itemKeyword}
                onChange={(e) => setItemKeyword(e.target.value)}
                placeholder="품목 검색"
              />

              {itemKeyword.trim().length > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    border: '1px solid #ddd',
                    background: 'white',
                    borderRadius: 8,
                    overflow: 'hidden',
                    zIndex: 10,
                    maxHeight: 240,
                    overflowY: 'auto',
                  }}
                >
                  {itemsLoading ? (
                    <div style={{ padding: 10 }}>검색 중...</div>
                  ) : filteredItems.length === 0 ? (
                    <div style={{ padding: 10 }}>검색 결과가 없습니다</div>
                  ) : (
                    filteredItems.map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => onSelectItem(it)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: 10,
                          border: 'none',
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        {it.name}
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>

            {/* 선택 품목 + 단가 수정 */}
            {selectedItems.length > 0 ? (
              <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                {selectedItems.map((x) => (
                  <div
                    key={x.itemId}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 200px 80px',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <div>{x.itemName}</div>
                    <Input
                      value={String(x.unitPrice ?? 0)}
                      onChange={onChangeUnitPrice(x.itemId)}
                      placeholder="단가"
                      inputMode="numeric"
                    />
                    <Button type="button" variant="outline" onClick={() => onRemoveItem(x.itemId)}>
                      X
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                공급처는 품목을 1개 이상 등록해야 합니다.
              </div>
            )}

            {!isValidSupplierItems ? (
              <div style={{ color: 'crimson', marginTop: 8, fontSize: 12 }}>
                품목 1개 이상 등록 + 단가를 모두 0보다 크게 입력해야 합니다.
              </div>
            ) : null}
          </div>
        ) : null}



        <div style={{ marginTop: 14 }}>
          <Button type="submit" disabled={!canSubmit}>
            {updating ? '저장 중...' : '완료'}
          </Button>

        
        </div>
      </form>
    </div>
  );
}
