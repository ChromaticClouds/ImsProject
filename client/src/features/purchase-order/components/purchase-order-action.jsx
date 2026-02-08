// src/features/purchase-order/components/purchase-order-action.jsx
import { Button } from '@/components/ui/button.js';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field.js';

import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';
import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';

export const PurchaseOrderAction = () => {
  const { selectedIds, clear } = usePurchaseOrderSelectionStore();
  const { bulkRemove, bulkMarkSent } = usePurchaseOrders();

  const hasSelection = selectedIds.length > 0;

  return (
    <div className='mt-6 flex flex-col gap-3'>
      <Field>
        <FieldLabel>일괄 처리</FieldLabel>

        <div className='flex gap-3 items-center'>
          <Button
            disabled={!hasSelection}
            onClick={() => {
              bulkMarkSent(selectedIds);
              clear();
            }}
          >
            선택 전송
          </Button>

          <Button
            variant='destructive'
            disabled={!hasSelection}
            onClick={() => {
              const ok = window.confirm('선택한 발주서를 삭제 하시겠습니까?');
              if (!ok) return;
              bulkRemove(selectedIds);
              clear();
            }}
          >
            선택 삭제
          </Button>

          <span className='text-sm text-muted-foreground'>
            {hasSelection ? `${selectedIds.length}건 선택됨` : '선택된 항목 없음'}
          </span>
        </div>

        <FieldDescription>
          (mock) 체크된 발주를 전송/삭제합니다. 나중에 API로 교체할 때 이 로직만 서버 호출로 바꾸면 됩니다.
        </FieldDescription>
      </Field>
    </div>
  );
};
