// @ts-check
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';

const formatNumber = (n) => Number(n || 0).toLocaleString();

/**
 * @typedef {Object} PurchaseOrderFormItem
 * @property {number} orderId
 * @property {string} productName
 * @property {string} type
 * @property {string} brand
 * @property {number} safetyStock
 * @property {number|string} count
 * @property {number} purchasePrice
 */

/**
 * @typedef {Object} PurchaseOrderFormState
 * @property {string} orderNumber
 * @property {string} orderDate
 * @property {string} recieveDate
 * @property {string} vendorName
 * @property {PurchaseOrderFormItem[]} items
 */

/**
 * @param {{
 *  initialValue: PurchaseOrderFormState,
 *  onSubmit: (payload: {recieveDate:string, items:{orderId:number, count:number}[]}) => void
 * }} props
 */
export const PurchaseOrderForm = ({ initialValue, onSubmit }) => {
  /** @type {[PurchaseOrderFormState, import('react').Dispatch<import('react').SetStateAction<PurchaseOrderFormState>>]} */
  const [form, setForm] = useState({
    ...initialValue,
    items: Array.isArray(initialValue?.items) ? initialValue.items : [],
  });

  /** @param {keyof PurchaseOrderFormState} key @param {any} value */
  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const totalCount = useMemo(
    () =>
      (Array.isArray(form.items) ? form.items : []).reduce(
        (sum, it) => sum + Number(it.count || 0),
        0
      ),
    [form.items]
  );

  const typeLabelMap = {
  SOJU: '소주',
  LIQUOR: '양주',
  KAOLIANG_LIQUOR: '고량주',
  TRADITIONAL: '전통주',
  WHISKEY: '위스키',
};

const isValidCount = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
};

const formatSafetyStock = (v) => {
  if (v == null) return '-';
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return n.toFixed(1);
};

const submitDisabled =
  !form.recieveDate ||
  !Array.isArray(form.items) ||
  form.items.length === 0 ||
  form.items.some((it) => !isValidCount(it.count));

const formatType = (type) => typeLabelMap[type] ?? type ?? '-';

  const totalPrice = useMemo(
    () =>
      (Array.isArray(form.items) ? form.items : []).reduce(
        (sum, it) => sum + Number(it.count || 0) * Number(it.purchasePrice || 0),
        0
      ),
    [form.items]
  );

  const submit = () => {
    if (!form.recieveDate) return alert('납기일을 선택해주세요');

    const payload = {
      recieveDate: form.recieveDate,
      items: (Array.isArray(form.items) ? form.items : []).map((it) => ({
        orderId: it.orderId,
        count: Number(it.count || 0),
      })),
    };

    onSubmit(payload);
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>발주번호</Label>
        <Input
          className='col-span-10'
          value={form.orderNumber}
          readOnly
          disabled
        />
      </div>

      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>발주일</Label>
        <Input
          className='col-span-10'
          value={form.orderDate}
          readOnly
          disabled
        />
      </div>

      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>공급처</Label>
        <Input
          className='col-span-10'
          value={form.vendorName ?? ''}
          readOnly
          disabled
        />
      </div>

      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>납기일</Label>
        <Input
          className='col-span-10'
          type='date'
          value={form.recieveDate ?? ''}
          onChange={(e) => setField('recieveDate', e.target.value)}
        />
      </div>

      {/* 품목 라인 */}
      <div className='rounded-lg border overflow-hidden'>
        <div className='grid grid-cols-12 text-xs font-medium bg-muted px-3 py-2'>
          <div className='col-span-4'>품목명</div>
          <div className='col-span-2 text-center'>주종</div>
          <div className='col-span-2 text-center'>브랜드</div>
          <div className='col-span-2 text-center'>안전재고</div>
          <div className='col-span-2 text-center'>발주수량</div>
        </div>

        {form.items.length ? (
          form.items.map((it) => (
            <div
              key={it.orderId}
              className='grid grid-cols-12 px-3 py-2 text-sm border-t items-center'
            >
              <div className='col-span-4 truncate'>{it.productName ?? '-'}</div>
              <div className='col-span-2 text-center'>{formatType(it.type) ?? '-'}</div>
              <div className='col-span-2 text-center'>{it.brand ?? '-'}</div>
              <div className='col-span-2 text-center'>{formatSafetyStock(it.safetyStock) ?? 0}</div>

              <div className='col-span-2'>
                <Input
                  inputMode='numeric'
                  value={String(it.count ?? 0)}
                  onChange={(e) => {
                    const next = e.target.value.replace(/[^\d]/g, '');

                    setForm((prev) => {
                      const prevItems = Array.isArray(prev.items)
                        ? prev.items
                        : [];

                      return {
                        ...prev,
                        items: prevItems.map((x) =>
                          String(x.orderId) === String(it.orderId)
                            ? { ...x, count: next }
                            : x
                        ),
                      };
                    });
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className='px-3 py-6 text-sm text-muted-foreground text-center'>
            수정할 품목이 없습니다
          </div>
        )}
      </div>

      <div className='text-sm text-muted-foreground flex justify-between'>
        <span>합계 수량: {formatNumber(totalCount)}</span>
        <span>합계 금액: {formatNumber(totalPrice)}원</span>
      </div>

      <div className='flex justify-end gap-2'>
        <Button onClick={submit} disabled={submitDisabled}>수정 저장</Button>
      </div>
    </div>
  );
};
