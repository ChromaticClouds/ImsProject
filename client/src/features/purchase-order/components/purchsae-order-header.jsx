// src/features/purchase-order/components/purchase-order-header.jsx
import { Button } from '@/components/ui/button.js';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';

import { PurchaseOrderSearch } from '@/features/purchase-order/components/purchase-order-search.jsx';
import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';
import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders';
import { useNavigate } from 'react-router-dom';
import { Trash2Icon } from 'lucide-react';

import { PurchaseOrderBulkActions } from '@/features/purchase-order/components/purchase-order-bulk-action';

export const PurchaseOrderHeader = () => {
  const { selectedIds, clear } = usePurchaseOrderSelectionStore();
  const { bulkRemove } = usePurchaseOrders(); // 삭제 버튼용
  // const { bulkMarkSent } = usePurchaseOrders();
  const navigate = useNavigate();

  const hasSelection = selectedIds.length > 0;
  const selectedCount = selectedIds.length;


  return (
    <CardHeader className='border-b flex flex-col'>
      <div className='w-full flex justify-between'>
        {/* 왼쪽: 제목 */}
        <div className='flex flex-col gap-3 overflow-hidden'>
          <CardTitle className='text-nowrap'>발주 목록</CardTitle>
          <CardDescription className='text-nowrap'>
            전송 전/전송 완료 발주 내역을 확인하세요
          </CardDescription>
        </div>

        {/* 오른쪽: 액션 영역 */}
        <div className='flex gap-4 items-center'>
          {/* 검색 */}
          <PurchaseOrderSearch />

          {/* 선택 관련 액션 묶음 */}
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2 py-1 rounded-md'>
               {/* 선택 전송/취소/confirm은 BulkActions가 담당 */}
              <PurchaseOrderBulkActions />

              {/* 선택 삭제 버튼 */}
              <Button
                size='sm'
                variant='destructive'
                disabled={!hasSelection}
                onClick={() => {
                  const ok = window.confirm(
                    '선택한 발주서를 삭제 하시겠습니까?',
                  );
                  if (!ok) return;
                  bulkRemove(selectedIds);
                  clear();
                }}
              >
                {/* <Trash2Icon className='w-4 h-4' /> */}
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
