//@ts-check
import { CardFooter } from '@/components/ui/card.js';
import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';
import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';

export const PurchaseOrderFooter = () => {
  const { view } = usePurchaseOrderFilterStore();
  const { summaryDraft, summarySent } = usePurchaseOrders();

  const s = view === 'SENT' ? summarySent : summaryDraft;

  return (
    <CardFooter className='border-t'>
      <div className='w-full flex justify-between'>
        <span>{s.itemKinds}건</span>
        <span>총수량 {s.totalCount}</span>
      </div>
    </CardFooter>
  );
};
