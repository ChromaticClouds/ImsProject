import { Button } from '@/components/ui/button.js';
import { SendIcon } from 'lucide-react';

import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';
import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';

/**
 * @param {{ onReload?: () => Promise<any> }} props
 */
export const PurchaseOrderBulkActions = ({ onReload }) => {
  const { bulkMarkSent } = usePurchaseOrders();
  const { selectedOrderNumbers, clear } = usePurchaseOrderSelectionStore();

  const n = selectedOrderNumbers.length;
  const hasSelection = n > 0;

  const onBulkSend = async () => {
    if (!hasSelection) return;

    const ok = window.confirm(`${n}개가 전송되어집니다.`);
    if (!ok) return;

    await bulkMarkSent(selectedOrderNumbers);
    clear();
    await onReload?.();
  };

  return (
    <div className='flex items-center gap-2'>
      <Button disabled={!hasSelection} onClick={onBulkSend} className='gap-2'>
        <SendIcon className='w-4 h-4' />
        선택 전송
      </Button>

      <Button variant='secondary' onClick={clear} disabled={!hasSelection}>
        선택 해제
      </Button>
    </div>
  );
};
