// @ts-check
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateVendor } from '@/features/vendor/hooks/use-create-vendor';
import { useItemsSearch } from '@/features/vendor/hooks/use-items-search';

/**
 * @typedef {'Supplier'|'Seller'} VendorType
 *
 * @typedef {object} SelectedItem
 * @property {number} itemId
 * @property {string} itemName
 * @property {number} unitPrice
 */

/**
 * @typedef {object} VendorCreateForm
 * @property {VendorType} type
 * @property {string} 대표자명
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

export function VendorCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useCreateVendor();

  /** @type {[VendorCreateForm, Function]} */
  const [form, setForm] = useState({
    type: /** @type {VendorType} */ ('Supplier'),
    대표자명: '',
    거래처명: '',
    전화번호: '',
    이메일: '',
    주소: '',
    메모: '',
  });

  const [touched, setTouched] = useState({
    대표자명: false,
    거래처명: false,
    전화번호: false,
    이메일: false,
    주소: false,
  });

  const [itemKeyword, setItemKeyword] = useState('');
  const [selectedItems, setSelectedItems] = useState(/** @type {SelectedItem[]} */ ([]));

  const { data: itemsData, isFetching: itemsLoading } = useItemsSearch({
    keyword: itemKeyword.trim(),
    excludeAssigned: true,
  });

  // itemsData는 [{id, name}] 배열이라고 가정
  const items = /** @type {{ id: number, name: string }[]} */ (itemsData ?? []);

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

    // 판매처로 바꾸면 품목/단가 숨김 + 상태 초기화
    if (type === 'Seller') {
      setItemKeyword('');
      setSelectedItems([]);
    }
  };

  const markTouched = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const errors = useMemo(() => {
    /** @type {Record<string, string | undefined>} */
    const e = {};

    const ceo = form.대표자명.trim();
    const name = form.거래처명.trim();
    const phone = form.전화번호.trim();
    const email = form.이메일.trim();
    const addr = form.주소.trim();

    if (!ceo) e.대표자명 = '미입력되었습니다';
    else if (ceo.length < 2 || ceo.length > 10) e.대표자명 = '대표자명은 2~10자만 허용됩니다';

    if (!name) e.거래처명 = '미입력되었습니다';

    if (!phone) e.전화번호 = '미입력되었습니다';
    else if (!phoneRegex.test(phone)) e.전화번호 = '전화번호 양식이 올바르지 않습니다 (예: 010-1234-5678)';

    if (!email) e.이메일 = '미입력되었습니다';
    else if (!emailRegex.test(email)) e.이메일 = '이메일 양식이 올바르지 않습니다';

    if (!addr) e.주소 = '미입력되었습니다';

    return e;
  }, [form]);

  const isValidRequired = useMemo(() => {
    return !errors.대표자명 && !errors.거래처명 && !errors.전화번호 && !errors.이메일 && !errors.주소;
  }, [errors]);


  const isSupplier = form.type === 'Supplier';

  const isValidItemsForSupplier = useMemo(() => {
    if (!isSupplier) return true; // 판매처는 통과

    if (selectedItems.length === 0) return false;

    return selectedItems.every((x) => Number.isFinite(x.unitPrice) && x.unitPrice > 0);
  }, [isSupplier, selectedItems]);


  const canSubmit = isValidRequired && isValidItemsForSupplier && !isPending;

  const onSelectItem = (it) => {
    setSelectedItems((prev) => [...prev, { itemId: it.id, itemName: it.name, unitPrice: 0 }]);
    setItemKeyword('');
  };

  const onChangeUnitPrice = (itemId) => (e) => {
    const v = e.target.value.replace(/[^\d]/g, '');
    const num = v ? Number(v) : 0;
    setSelectedItems((prev) => prev.map((x) => (x.itemId === itemId ? { ...x, unitPrice: num } : x)));
  };

  const onRemoveItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((x) => x.itemId !== itemId));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      대표자명: true,
      거래처명: true,
      전화번호: true,
      이메일: true,
      주소: true,
    });

    // 필수 입력 방어
    if (!isValidRequired) {
      alert('미입력되었습니다');
      return;
    }


    if (form.type === 'Supplier') {
      if (selectedItems.length === 0) {
        alert('공급처는 품목을 1개 이상 선택해야 합니다.');
        return;
      }
      if (selectedItems.some((x) => !x.unitPrice || x.unitPrice <= 0)) {
        alert('공급처는 선택된 모든 품목의 단가를 1원 이상 입력해야 합니다.');
        return;
      }
    }

    /** @type {any} */
    const payload = {
      type: form.type,
      vendorName: form.거래처명.trim(),
      telephone: form.전화번호.trim(),
      email: form.이메일.trim(),
      bossName: form.대표자명.trim(),
      address: form.주소.trim(),
      memo: form.메모?.trim() || null,

      items: form.type === 'Supplier'
        ? selectedItems.map((x) => ({
            productId: x.itemId,
            purchasePrice: x.unitPrice,
          }))
        : [],
    };

    try {
  const res = await mutateAsync(payload);
  console.log('createVendor success:', res);

  alert('등록되었습니다'); 

  navigate('/dashboard/vendor');
} catch (err) {
  console.error('createVendor failed:', err);
  alert(err?.message ?? '등록 중 오류가 발생했습니다.');
}
  };

  return (
    <div>
      <h1>거래처 등록</h1>

      <form onSubmit={onSubmit}>
        <div>
          <span>구분</span>
          <br />

          <label>
            <input
              type="radio"
              name="vendorType"
              checked={form.type === 'Supplier'}
              onChange={() => setType('Supplier')}
            />
            공급처
          </label>

          <label style={{ marginLeft: 12 }}>
            <input
              type="radio"
              name="vendorType"
              checked={form.type === 'Seller'}
              onChange={() => setType('Seller')}
            />
            판매처
          </label>
        </div>

        <div>
          <div>
            <span>대표자명 *</span>
            {touched.대표자명 && errors.대표자명 ? (
              <span style={{ color: 'crimson', marginLeft: 8 }}>{errors.대표자명}</span>
            ) : null}
          </div>
          <Input
            value={form.대표자명}
            onChange={setField('대표자명')}
            onBlur={markTouched('대표자명')}
            placeholder="2~10자"
          />
        </div>

        <div>
          <div>
            <span>거래처명 *</span>
            {touched.거래처명 && errors.거래처명 ? (
              <span style={{ color: 'crimson', marginLeft: 8 }}>{errors.거래처명}</span>
            ) : null}
          </div>
          <Input value={form.거래처명} onChange={setField('거래처명')} onBlur={markTouched('거래처명')} />
        </div>

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

        <div>
          <div>
            <span>주소 *</span>
            {touched.주소 && errors.주소 ? (
              <span style={{ color: 'crimson', marginLeft: 8 }}>{errors.주소}</span>
            ) : null}
          </div>
          <Input value={form.주소} onChange={setField('주소')} onBlur={markTouched('주소')} />
        </div>

        <div>
          <span>메모</span>
          <Input value={form.메모} onChange={setField('메모')} />
        </div>

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
                    <div style={{ padding: 10 }}>
                      검색 결과가 없습니다
                    </div>
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
                단가 입력
              </div>
            )}
          </div>
        ) : null}

        {error ? (
          <div style={{ color: 'crimson', marginTop: 10 }}>
            등록 실패: {error.message}
          </div>
        ) : null}

        {/* 공급처일 때 비활성화 사유 안내 */}
        {form.type === 'Supplier' && !isValidItemsForSupplier ? (
          <div style={{ color: 'crimson', marginTop: 10 }}>
            
          </div>
        ) : null}

        console.log('payload', JSON.stringify(payload, null, 2));

        <div style={{ marginTop: 14 }}>
          {/* Supplier: 필수+품목+단가 */}
          <Button type="submit" disabled={!canSubmit} variant='default'>
            {isPending ? '저장 중...' : '완료'}
          </Button>
        </div>
      </form>
    </div>
  );
}
