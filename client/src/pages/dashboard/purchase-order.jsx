//@ts-check
import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';

import { PurchaseOrderAction } from '@/features/purchase-order/components/purchase-order-action.jsx';
import { PurchaseOrderFooter } from '@/features/purchase-order/components/purchase-order-footer.jsx';
import { PurchaseOrderHeader } from '@/features/purchase-order/components/purchsae-order-header';
import { PurchaseOrderList } from '@/features/purchase-order/components/purchase-order-list.jsx';
import { PurchaseOrderPicker } from '@/features/purchase-order/components/purchase-order-picker.jsx';

export const PurchaseOrder = () => {
  return (
    <div className='w-full flex flex-col'>
      <AppHeader
        title='발주 관리'
        description='발주서 전송 전/전송 완료 내역을 확인하고 발주서를 작성/전송합니다'
      />

      <PurchaseOrderPicker />

      <div className='mt-6'>
        <Card>
          <PurchaseOrderHeader />
          <PurchaseOrderList />
          <PurchaseOrderFooter />
        </Card>
      </div>

      <PurchaseOrderAction />
    </div>
  );
};
