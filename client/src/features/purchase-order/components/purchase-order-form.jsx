//@ts-check
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';

// 변경한 mock 파일/exports에 맞춤
import { testvendors } from '@/features/purchase-order/mocks/test-vendor-mock.js';
import { testvendorItems } from '@/features/purchase-order/mocks/test-vendor-item-mock.js';

export const PurchaseOrderForm = ({ mode, initialValue, onSubmit }) => {
  const [form, setForm] = useState(initialValue);

  // purchaseOrders 스키마에 맞게 sellerVendorId 사용
  const selectedVendor = useMemo(
    () =>
      testvendors?.find((v) => String(v.id) === String(form.sellerVendorId)),
    [form.sellerVendorId],
  );

  // vendorItem 스키마: vendorId 로 필터링
  const itemsForVendor = useMemo(() => {
    if (!form.sellerVendorId) return [];
    return testvendorItems?.filter(
      (it) => String(it.vendorId) === String(form.sellerVendorId),
    );
  }, [form.sellerVendorId]);

  const selectedItem = useMemo(
    () =>
      itemsForVendor.find((it) => String(it.id) === String(form.venderItemId)),
    [itemsForVendor, form.venderItemId],
  );

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleVendorChange = (e) => {
    const vendorId = e.target.value ? Number(e.target.value) : null;

    // 공급처 바뀌면 품목도 초기화
    setForm((prev) => ({
      ...prev,
      sellerVendorId: vendorId,
      venderItemId: null,
      productId: null,
    }));
  };

  const handleItemChange = (e) => {
    const itemId = e.target.value ? Number(e.target.value) : null;
    const item = itemsForVendor.find((it) => String(it.id) === String(itemId));

    setForm((prev) => ({
      ...prev,
      venderItemId: itemId,
      productId: item?.productId ?? null,
    }));
  };

  const submit = () => {
    // 최소 검증
    if (!form.recieveDate) return alert('납기일을 선택해주세요');
    if (!form.sellerVendorId) return alert('공급처를 선택해주세요');
    if (!form.venderItemId) return alert('품목을 선택해주세요');
    if (!form.count || Number(form.count) <= 0)
      return alert('수량을 입력해주세요');

    onSubmit(form);
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* 발주번호(읽기 전용) */}
      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>발주번호</Label>
        <Input
          className='col-span-10'
          value={form.orderNumber}
          readOnly
          disabled
        />
      </div>

      {/* 발주일(기본값: 금일 / 읽기 전용) */}
      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>발주일</Label>
        <Input
          className='col-span-10'
          value={form.orderDate}
          readOnly
          disabled
        />
      </div>

      {/* 납기일(입력 가능) */}
      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>납기일</Label>
        <Input
          className='col-span-10'
          type='date'
          value={form.recieveDate ?? ''}
          onChange={(e) => setField('recieveDate', e.target.value)}
        />
      </div>

      {/* 공급처 선택(드롭다운) */}
      <div className='grid grid-cols-12 gap-2 items-center'>
        <Label className='col-span-2'>공급처</Label>
        <select
          className='col-span-10 h-10 rounded-md border bg-background px-3'
          value={form.sellerVendorId ?? ''}
          onChange={handleVendorChange}
          disabled={mode === 'edit'} // 수정페이지에 공급처 수정 불가
        >
  
          <option value=''>공급처 선택</option>
          {testvendors?.map((v) => (
            <option
              key={v.id}
              value={v.id}
            >
              {v.vendorName}
            </option>
          ))}
        </select>

        {mode === 'edit' ? (
            <p className='col-span-10 px-2 col-start-3 text-sm text-amber-600'>
              공급처는 수정이 불가합니다.
            </p>
        ) : null}

      </div>

      {/* 공급처 선택 시 자동 기입(읽기 전용) */}
      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>대표자명</Label>
        <Input
          className='col-span-10'
          value={selectedVendor?.bossName ?? ''}
          readOnly
          disabled
        />
      </div>

      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>공급처명</Label>
        <Input
          className='col-span-10'
          value={selectedVendor?.vendorName ?? ''}
          readOnly
          disabled
        />
      </div>

      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>전화번호</Label>
        <Input
          className='col-span-10'
          value={selectedVendor?.telephone ?? ''}
          readOnly
          disabled
        />
      </div>

      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>이메일</Label>
        <Input
          className='col-span-10'
          value={selectedVendor?.email ?? ''}
          readOnly
          disabled
        />
      </div>

      {/* 품목 선택(공급처 담당 품목만) */}
      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>품목 선택</Label>
        <select
          className='col-span-10 h-10 rounded-md border bg-background px-3'
          value={form.venderItemId ?? ''}
          onChange={handleItemChange}
          disabled={!form.sellerVendorId}
        >
          <option value=''>
            {form.sellerVendorId ? '품목 선택' : '먼저 공급처를 선택하세요'}
          </option>

          {itemsForVendor.map((it) => (
            <option
              key={it.id}
              value={it.id}
            >
              {/* label이 없을 수도 있으니 안전한 표시 */}
              {it.label ??
                `상품ID ${it.productId} · 구매가 ${it.purchasePrice}`}
            </option>
          ))}
        </select>
      </div>

      {/* 선택한 품목 정보(선택 사항: 확인용) */}
      {selectedItem ? (
        <div className='grid grid-cols-12 gap-4 items-center'>
          <Label className='col-span-2'>구매가</Label>
          <Input
            className='col-span-10'
            value={selectedItem.purchasePrice ?? ''}
            readOnly
            disabled
          />
        </div>
      ) : null}

      {/* 수량 */}
      <div className='grid grid-cols-12 gap-4 items-center'>
        <Label className='col-span-2'>수량</Label>
        <Input
          className='col-span-10'
          inputMode='numeric'
          placeholder='수량 입력'
          value={form.count}
          onChange={(e) => setField('count', e.target.value)}
        />
      </div>

      {/* 저장 버튼 */}
      <div className='flex justify-end gap-2'>
        <Button onClick={submit}>
          {mode === 'edit' ? '수정 저장' : '등록'}
        </Button>
      </div>
    </div>
  );
};
