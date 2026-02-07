//@ts-check
// src/features/purchase-order/components/purchase-order-picker.jsx
// import { AppDateRangePicker } from '@/components/common/app-date-range-picker.jsx'; // 날짜 일단 주석 처리함
import { Button } from '@/components/ui/button';  // 버튼 형식으로 변경 중
// import { Label } from '@/components/ui/label.js'; // 토글도 일단
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.js'; // 토글 일단

import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';

export const PurchaseOrderPicker = () => {
  const { range, setRange, view, setView } = usePurchaseOrderFilterStore();


  return (
    <section className='flex flex-col gap-4'>
      {/* <div className='flex gap-3 items-center'>
        <span>날짜선택</span>
        <AppDateRangePicker value={range} onChange={(e) => setRange(e)} />
      </div> */}

      <div className='flex gap-7  items-center'>
        {/* <span>내역 구분   </span> */}
        <span> </span>

          <div className='flex gap-4 rounded-lg bg bg-muted p-1'>
            <Button className='h-9'
              variant={view ==='DRAFT' ? 'default':'secondary'}
              onClick={() => setView('DRAFT')}> 
                전송 전 내역
            </Button>
         
            <Button className='h-9'
              variant={view ==='SENT'? 'default':'secondary'}
              onClick={() => setView('SENT')}>
                전송 완료 내역
              </Button>
          </div>
       
      </div>
    </section>
  );
};
