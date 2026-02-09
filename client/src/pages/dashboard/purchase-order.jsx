// @ts-check

import { useEffect } from 'react';
import { useMemo } from 'react';
import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';


import { PurchaseOrderFooter } from '@/features/purchase-order/components/purchase-order-footer.jsx';
import { PurchaseOrderHeader } from '@/features/purchase-order/components/purchsae-order-header';
import { PurchaseOrderList } from '@/features/purchase-order/components/purchase-order-list.jsx';
import { PurchaseOrderPicker } from '@/features/purchase-order/components/purchase-order-picker.jsx';

import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';
import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';
import { usePurchaseOrderPagination } from '@/features/purchase-order/hooks/use-purchase-order-pagination.js';

export const PurchaseOrder = () => {
  const { rows } = usePurchaseOrders();
  const { view, keyword, range, filterFn } = usePurchaseOrderFilterStore();

  // 필터 적용된 전체 데이터
  const filtered = useMemo(
    () => rows.filter(filterFn),
    [rows, view, keyword, range]
  );

  const pagination = usePurchaseOrderPagination(filtered);

  useEffect(() => {
    pagination.setCurrentPage(1);
  }, [view, keyword, range]); 

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
           <PurchaseOrderList rows={pagination.paginatedList}/>
           <PurchaseOrderFooter pagination={pagination} totalCount={filtered.length} />
        </Card>
      </div>

      {/* <PurchaseOrderAction /> */}
    </div>
  );
};
