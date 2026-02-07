// src/features/purchase-order/components/purchase-order-header.jsx
import { Button } from '@/components/ui/button.js';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';

import { PurchaseOrderSearch } from '@/features/purchase-order/components/purchase-order-search.jsx';
import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';
import { usePurchaseOrders } from '../hooks/use-purchase-orders';

export const PurchaseOrderHeader = () => {
  const { selectedIds, clear } = usePurchaseOrderSelectionStore();
  const { bulkMarkSent} = usePurchaseOrders();

  const hasSelection = selectedIds.length > 0;

  return (
    <CardHeader className='border-b flex flex-col'>
      <div className='w-full flex justify-between'>
        <div className='flex flex-col gap-3 overflow-hidden'>
          <CardTitle className='text-nowrap'>발주 목록</CardTitle>
          <CardDescription className='text-nowrap'>
            전송 전/전송 완료 발주 내역을 확인하세요
          </CardDescription>
        </div>

        <div className='flex gap-3 items-center'>
          <PurchaseOrderSearch />

          {/* ✅ 대량 전송 */}
          <Button
            disabled={!hasSelection}
            onClick={() => {
              bulkMarkSent(selectedIds);
              clear();
            }}
          >
            발주서 전송
          </Button>

          {/* TODO: 라우팅 연결 */}
          <Button onClick={() => console.log('go: /dashbord/purchase-order/new')}>
            발주서 작성
          </Button>

          <Button variant='secondary' onClick={clear}>
            선택 해제
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};
