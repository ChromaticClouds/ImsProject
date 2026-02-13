// src/features/purchase-order/components/purchase-order-header.jsx
import { Button } from '@/components/ui/button.js';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';

import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';
import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';

import { PurchaseOrderBulkActions } from '@/features/purchase-order/components/purchase-order-bulk-action.jsx';
import { BadgeCheckIcon, BadgeIcon, BadgeMinusIcon } from 'lucide-react';

/**
 * @param {{ onReload?: () => Promise<any> }} props
 */
export const PurchaseOrderHeader = ({ onReload }) => {
  const { selectedOrderNumbers, clear } = usePurchaseOrderSelectionStore();
  const { bulkRemove } = usePurchaseOrders();

  const selectedCount = selectedOrderNumbers.length;
  const hasSelection = selectedCount > 0;

  return (
    <CardHeader className='border-b flex flex-col'>
      <div className='w-full flex justify-between'>
        {/* 제목 */}
        <div className='flex flex-col gap-3 overflow-hidden'>
          <CardTitle className='text-nowrap'>발주 목록</CardTitle>
          <CardDescription className='text-nowrap'>
            전송 전/전송 완료 발주 내역을 확인하세요
          </CardDescription>
        </div>

        <div className='flex gap-4 items-center'>
          <div className='flex flex-col gap-1'>

            
            <div className='flex items-center gap-2 py-1 rounded-md'>
              {/* 선택 전송 */}
              <PurchaseOrderBulkActions onReload={onReload} />

              {/* 선택 삭제 */}
              <Button
                size='sm'
                variant='destructive'
                disabled={!hasSelection}
                onClick={async () => {
                  const ok = window.confirm('선택한 발주서를 삭제 하시겠습니까?');
                  if (!ok) return;

                  await bulkRemove(selectedOrderNumbers);
                  clear();
                  await onReload?.();
                }}
              >
                선택 삭제
              </Button>
            </div>

            {/* 선택 상태 안내 */}
            <span className='text-xs text-muted-foreground'>
              {selectedCount === 0 && '선택된 항목이 없습니다'}
              {selectedCount === 1 && '1건 선택됨 · 단일 전송'}
              {selectedCount > 1 && `${selectedCount}건 선택됨 · 일괄 전송`}
            </span>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};
