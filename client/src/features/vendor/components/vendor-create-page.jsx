

// @ts-check
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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

const toMoney = (n) => Number(n || 0).toLocaleString();

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

  const isSupplier = form.type === 'Supplier';

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

    if (!isValidRequired) {
      alert('필수 입력값을 확인해주세요.');
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
      items:
        form.type === 'Supplier'
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

  const showSearchDropdown = isSupplier && itemKeyword.trim().length > 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/40">
      <div className="mx-auto max-w-[1200px] px-5 py-6">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">거래처 등록</h1>
              <Badge variant="secondary">{form.type}</Badge>
              {isPending ? <Badge>저장중</Badge> : null}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              거래처 기본정보를 입력하고, 공급처(Supplier)인 경우 품목/단가를 설정하세요.
            </div>
          </div>

        
        </div>

        {/* Error banner */}
        {error ? (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            등록 실패: {error.message}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="grid grid-cols-12 gap-4">
          {/* Left */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <div className="rounded-2xl border bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-semibold">구분</div>
                
              </div>

                            <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    name="vendorType"
                    checked={form.type === 'Supplier'}
                    onChange={() => setType('Supplier')}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>공급처</span>
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    name="vendorType"
                    checked={form.type === 'Seller'}
                    onChange={() => setType('Seller')}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>판매처</span>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="mb-3 font-semibold">기본 정보</div>

              <div className="grid grid-cols-12 gap-3">
                <Field
                  label="대표자명"
                  required
                  value={form.대표자명}
                  onChange={setField('대표자명')}
                  onBlur={markTouched('대표자명')}
                  placeholder="2~10자"
                  error={touched.대표자명 ? errors.대표자명 : undefined}
                  colSpan="col-span-12 md:col-span-6"
                />

                <Field
                  label="거래처명"
                  required
                  value={form.거래처명}
                  onChange={setField('거래처명')}
                  onBlur={markTouched('거래처명')}
                  placeholder="거래처명을 입력"
                  error={touched.거래처명 ? errors.거래처명 : undefined}
                  colSpan="col-span-12 md:col-span-6"
                />

                <Field
                  label="전화번호"
                  required
                  value={form.전화번호}
                  onChange={setField('전화번호')}
                  onBlur={markTouched('전화번호')}
                  placeholder="010-1234-5678"
                  inputMode="numeric"
                  error={touched.전화번호 ? errors.전화번호 : undefined}
                  colSpan="col-span-12 md:col-span-6"
                />

                <Field
                  label="이메일"
                  required
                  value={form.이메일}
                  onChange={setField('이메일')}
                  onBlur={markTouched('이메일')}
                  placeholder="example@email.com"
                  error={touched.이메일 ? errors.이메일 : undefined}
                  colSpan="col-span-12 md:col-span-6"
                />

                <Field
                  label="주소"
                  required
                  value={form.주소}
                  onChange={setField('주소')}
                  onBlur={markTouched('주소')}
                  placeholder="주소를 입력"
                  error={touched.주소 ? errors.주소 : undefined}
                  colSpan="col-span-12"
                />

                <div className="col-span-12">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-sm font-semibold">메모</div>
                    <div className="text-xs text-muted-foreground">선택</div>
                  </div>
                  <Textarea
                    value={form.메모}
                    onChange={setField('메모')}
                    placeholder="메모를 입력하세요"
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-5 space-y-4">
              <div className="rounded-2xl border bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-semibold">품목 설정</div>
                  <Badge variant="secondary">{isSupplier ? '필수' : '미사용'}</Badge>
                </div>

                {!isSupplier ? (
                  <div className="rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground">
                    판매처(Seller)는 품목/단가를 설정하지 않습니다.
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-muted-foreground">
                      품목을 검색해서 추가하고, 각 품목의 구매단가를 입력하세요.
                    </div>

                    <div className="relative mt-3">
                      <Input
                        value={itemKeyword}
                        onChange={(e) => setItemKeyword(e.target.value)}
                        placeholder="품목 검색"
                      />

                      {showSearchDropdown ? (
                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border bg-white shadow-xl">
                          {itemsLoading ? (
                            <div className="px-3 py-3 text-sm text-muted-foreground">검색 중...</div>
                          ) : filteredItems.length === 0 ? (
                            <div className="px-3 py-3 text-sm text-muted-foreground">검색 결과가 없습니다</div>
                          ) : (
                            <div className="max-h-[260px] overflow-auto">
                              {filteredItems.map((it) => (
                                <button
                                  key={it.id}
                                  type="button"
                                  onClick={() => onSelectItem(it)}
                                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted/40"
                                >
                                  <span className="truncate">{it.name}</span>
                                  <span className="text-xs text-muted-foreground">추가</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {/* Selected items */}
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-semibold">선택된 품목</div>
                        <div className="text-xs text-muted-foreground">{selectedItems.length}개</div>
                      </div>

                      {selectedItems.length === 0 ? (
                        <div className="rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground">
                          품목을 추가해주세요. (공급처는 최소 1개 필수)
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedItems.map((x) => {
                            const invalid = !x.unitPrice || x.unitPrice <= 0;

                            return (
                              <div key={x.itemId} className="rounded-xl border p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold">{x.itemName}</div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                      구매단가를 입력하세요
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => onRemoveItem(x.itemId)}
                                    className="rounded-md border px-2 py-1 text-xs font-semibold hover:bg-muted/40"
                                  >
                                    삭제
                                  </button>
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                  <Input
                                    value={String(x.unitPrice ?? 0)}
                                    onChange={onChangeUnitPrice(x.itemId)}
                                    placeholder="단가"
                                    inputMode="numeric"
                                    className={`text-right tabular-nums ${invalid ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                  />
                                  <div className="shrink-0 text-sm font-semibold text-muted-foreground">원</div>
                                </div>

                                {invalid ? (
                                  <div className="mt-1 text-xs text-destructive">단가는 1원 이상이어야 합니다.</div>
                                ) : (
                                  <div className="mt-1 text-xs text-muted-foreground">
                                    입력 단가: <span className="font-semibold">{toMoney(x.unitPrice)}원</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {!isValidItemsForSupplier ? (
                      <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                        공급처는 품목 1개 이상 + 모든 단가 1원 이상이 필요합니다.
                      </div>
                    ) : null}
                  </>
                )}
              </div>

              {/* Submit card */}
              <div className="rounded-2xl border bg-white p-4">
                <div className="mb-2 text-sm font-semibold">저장</div>
                <div className="text-xs text-muted-foreground">
                  필수 항목을 확인한 뒤 완료를 눌러 저장하세요.
                </div>

                <div className="mt-3 grid gap-2">
                  <Button id="vendor-create-submit" type="submit" disabled={!canSubmit} className="w-full">
                    {isPending ? '저장 중...' : '완료'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={isPending} className="w-full">
                    취소
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="h-8" />
      </div>
    </div>
  );
}

/**
 * @param {{
 *  label: string,
 *  required?: boolean,
 *  value: string,
 *  onChange: any,
 *  onBlur?: any,
 *  placeholder?: string,
 *  inputMode?: any,
 *  error?: string,
 *  colSpan?: string
 * }} props
 */
function Field({
  label,
  required = false,
  value,
  onChange,
  onBlur,
  placeholder,
  inputMode,
  error,
  colSpan = 'col-span-12',
}) {
  return (
    <div className={colSpan}>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-sm font-semibold">
          {label} {required ? <span className="text-destructive">*</span> : null}
        </div>
        {error ? <div className="text-xs text-destructive">{error}</div> : null}
      </div>

      <Input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        inputMode={inputMode}
        className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
      />
    </div>
  );
}
