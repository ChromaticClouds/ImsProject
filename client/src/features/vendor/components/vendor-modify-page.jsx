
// @ts-check
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { softDeleteVendorItem } from '@/features/vendor/api';
import { useVendorDetail } from '@/features/vendor/hooks/use-vendor-detail';
import { useUpdateVendor } from '@/features/vendor/hooks/use-update-vendor';
import { useItemsSearch } from '@/features/vendor/hooks/use-items-search';
import { Badge } from '@/components/ui/badge';

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

  useEffect(() => {
    if (!vendor) return;

    setForm({
      type: vendor.type,
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

  const { data: itemsData, isFetching: itemsLoading } = useItemsSearch({
    keyword: itemKeyword.trim(),
    excludeAssigned: true,
    currentVendorId: vendorId,
  });

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

  const isValidSupplierItems = useMemo(() => {
    if (form.type !== 'Supplier') return true;
    if (selectedItems.length < 1) return false;
    return selectedItems.every((x) => Number(x.unitPrice) > 0);
  }, [form.type, selectedItems]);

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
      type: form.type,
      vendorName: form.거래처명.trim(),
      telephone: form.전화번호.trim(),
      email: form.이메일.trim(),
      address: form.주소.trim(),
      memo: form.메모?.trim() || null,
      bossName: vendor?.bossName ?? null,
      items:
        form.type === 'Supplier'
          ? selectedItems.map((x) => ({
              productId: x.itemId,
              purchasePrice: x.unitPrice,
            }))
          : [],
    };

    try {
      await updateVendorMutate({ id: vendorId, payload });
      alert('수정되었습니다');
      navigate(`/dashboard/vendor/${vendorId}`);
    } catch (err) {
      console.error('updateVendor failed:', err);
      alert(err?.message ?? '수정 중 오류가 발생했습니다.');
    }
  };

  if (isLoading)
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground">로딩 중...</div>
      </div>
    );

  if (error)
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          에러: {error.message}
        </div>
      </div>
    );

  if (!vendor)
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground">
          거래처 정보를 찾을 수 없습니다.
        </div>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/40">
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        {/* Top bar */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">거래처 수정</h1>
              <Badge variant="secondary">{form.type === 'Supplier' ? '공급처' : '판매처'}</Badge>
              {updating ? <Badge className="bg-amber-500 text-white">저장중</Badge> : null}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              기본 정보를 수정하고, 공급처인 경우 품목/단가를 관리합니다.
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)} disabled={updating}>
              뒤로
            </Button>
            <Button type="submit" form="vendor-modify-form" disabled={!canSubmit}>
              {updating ? '저장 중...' : '완료'}
            </Button>
          </div>
        </div>

        <form id="vendor-modify-form" onSubmit={onSubmit}>
          <div className="grid grid-cols-12 gap-4">
            {/* Left: base fields */}
            <div className="col-span-12 lg:col-span-7">
              <div className="rounded-2xl border bg-white">
                <div className="border-b px-5 py-4">
                  <div className="font-semibold">기본 정보</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    * 표시는 필수 입력입니다.
                  </div>
                </div>

                <div className="p-5">
                  {/* 구분 */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-semibold">구분</span>
                      <span className="text-xs text-muted-foreground">수정 불가</span>
                    </div>

                    <div className="flex flex-wrap gap-4 rounded-xl border bg-muted/20 px-4 py-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" name="vendorType" checked={form.type === 'Supplier'} readOnly />
                        공급처
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" name="vendorType" checked={form.type === 'Seller'} readOnly />
                        판매처
                      </label>
                    </div>
                  </div>

                  {/* 거래처명 */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-semibold">거래처명 *</span>
                      {touched.거래처명 && errors.거래처명 ? (
                        <span className="text-xs text-destructive">{errors.거래처명}</span>
                      ) : null}
                    </div>
                    <Input
                      value={form.거래처명}
                      onChange={setField('거래처명')}
                      onBlur={markTouched('거래처명')}
                      className={touched.거래처명 && errors.거래처명 ? 'border-destructive focus-visible:ring-destructive' : ''}
                      placeholder="거래처명을 입력하세요"
                    />
                  </div>

                  {/* 전화번호 */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-semibold">전화번호 *</span>
                      {touched.전화번호 && errors.전화번호 ? (
                        <span className="text-xs text-destructive">{errors.전화번호}</span>
                      ) : null}
                    </div>
                    <Input
                      value={form.전화번호}
                      onChange={setField('전화번호')}
                      onBlur={markTouched('전화번호')}
                      placeholder="010-1234-5678"
                      inputMode="numeric"
                      className={touched.전화번호 && errors.전화번호 ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                  </div>

                  {/* 이메일 */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-semibold">이메일 *</span>
                      {touched.이메일 && errors.이메일 ? (
                        <span className="text-xs text-destructive">{errors.이메일}</span>
                      ) : null}
                    </div>
                    <Input
                      value={form.이메일}
                      onChange={setField('이메일')}
                      onBlur={markTouched('이메일')}
                      placeholder="example@email.com"
                      className={touched.이메일 && errors.이메일 ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                  </div>

                  {/* 주소 */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-semibold">주소 *</span>
                      {touched.주소 && errors.주소 ? (
                        <span className="text-xs text-destructive">{errors.주소}</span>
                      ) : null}
                    </div>
                    <Input
                      value={form.주소}
                      onChange={setField('주소')}
                      onBlur={markTouched('주소')}
                      placeholder="주소를 입력하세요"
                      className={touched.주소 && errors.주소 ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                  </div>

                  {/* 메모 */}
                  <div className="mb-1">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold">메모</span>
                      <span className="text-xs text-muted-foreground">선택</span>
                    </div>
                    <Input value={form.메모} onChange={setField('메모')} placeholder="메모를 입력하세요" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: supplier items */}
            <div className="col-span-12 lg:col-span-5">
              <div className="rounded-2xl border bg-white">
                <div className="border-b px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">품목 / 구매 단가</div>
                    <Badge variant="secondary">
                      {form.type === 'Supplier' ? `${selectedItems.length}개` : '해당 없음'}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    공급처일 때만 사용합니다.
                  </div>
                </div>

                <div className="p-5">
                  {form.type === 'Supplier' ? (
                    <>
                      {/* search */}
                      <div className="mb-3">
                        <div className="mb-2 text-sm font-semibold">품목 검색</div>
                        <div className="relative">
                          <Input
                            value={itemKeyword}
                            onChange={(e) => setItemKeyword(e.target.value)}
                            placeholder="품목 검색"
                          />

                          {itemKeyword.trim().length > 0 ? (
                            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-xl border bg-white shadow-sm">
                              <div className="max-h-60 overflow-y-auto">
                                {itemsLoading ? (
                                  <div className="px-3 py-2 text-sm text-muted-foreground">검색 중...</div>
                                ) : filteredItems.length === 0 ? (
                                  <div className="px-3 py-2 text-sm text-muted-foreground">검색 결과가 없습니다</div>
                                ) : (
                                  filteredItems.map((it) => (
                                    <button
                                      key={it.id}
                                      type="button"
                                      onClick={() => onSelectItem(it)}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted/40"
                                    >
                                      {it.name}
                                    </button>
                                  ))
                                )}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* selected list */}
                      {selectedItems.length > 0 ? (
                        <div className='overflow-hidden rounded-xl border'>
                          
                          <div className='grid grid-cols-12 bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground'>
                            <div className='col-span-7'>품목</div>
                            <div className='col-span-5 text-right'>단가</div>
                          </div>

                          <div className="divide-y">
                            {selectedItems.map((x) => {
                              const priceInvalid = form.type === 'Supplier' && (!x.unitPrice || x.unitPrice <= 0);
                              return (
                                <div key={x.itemId} className="grid grid-cols-12 items-center gap-2 px-3 py-3 hover:bg-muted/20">
                                  <div className="col-span-7 min-w-0">
                                    <div className="truncate text-sm font-medium">{x.itemName}</div>
                                    <div className="mt-1 text-[11px] text-muted-foreground">상품ID {x.itemId}</div>
                                  </div>

                                  <div className="col-span-4">
                                    <Input
                                      value={String(x.unitPrice ?? 0)}
                                      onChange={onChangeUnitPrice(x.itemId)}
                                      placeholder="단가"
                                      inputMode="numeric"
                                      className={`text-right tabular-nums ${
                                        priceInvalid ? 'border-destructive focus-visible:ring-destructive' : ''
                                      }`}
                                    />
                                    {priceInvalid ? (
                                      <div className="mt-1 text-[11px] text-destructive">1원 이상 입력</div>
                                    ) : null}
                                  </div>

                                  <div className="col-span-1 flex justify-end">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => onRemoveItem(x.itemId)}
                                      className="h-9 w-9 px-0"
                                      title="삭제"
                                    >
                                      X
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
                          공급처는 품목을 1개 이상 등록해야 합니다.
                        </div>
                      )}

                      {!isValidSupplierItems ? (
                        <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                          품목 1개 이상 등록 + 단가를 모두 0보다 크게 입력해야 합니다.
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="rounded-xl border bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
                      판매처는 품목/단가를 사용하지 않습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* bottom action (mobile) */}
          <div className="mt-4 flex items-center justify-end gap-2 lg:hidden">
            <Button variant="secondary" onClick={() => navigate(-1)} disabled={updating}>
              뒤로
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {updating ? '저장 중...' : '완료'}
            </Button>
          </div>
        </form>

        <div className="h-8" />
      </div>
    </div>
  );
}
