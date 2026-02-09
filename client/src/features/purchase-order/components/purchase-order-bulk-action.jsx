import { Button } from '@/components/ui/button.js';
import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';
import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';
import { testvendors } from '@/features/purchase-order/mocks/test-vendor-mock.js';
import { SendIcon } from 'lucide-react';

export const PurchaseOrderBulkActions = () => {
  const { rows, bulkMarkSent, markSent } = usePurchaseOrders();
  const { selectedIds, clear } = usePurchaseOrderSelectionStore();

  const n = selectedIds.length;
  const hasSelection = n > 0;

  const buildVendorConfirm = (order) => {
    const vendor = testvendors.find(
      (v) => String(v.id) === String(order.sellerVendorId)
    );

    return (
      `이 정보가 맞습니까?\n\n` +
      `공급처명: ${vendor?.vendorName ?? '-'}\n` +
      `대표자명: ${vendor?.bossName ?? '-'}\n` +
      `전화번호: ${vendor?.telephone ?? '-'}\n` +
      `이메일: ${vendor?.email ?? '-'}\n\n` +
      `발주번호: ${order.orderNumber}\n` +
      `발주일: ${order.orderDate}\n` +
      `납기일: ${order.recieveDate}\n` +
      `발주 수량: ${order.count ?? 0}`
    );
  };

  const onBulkSend = () => {
    if (!hasSelection) return;

    // 선택 1건이면: 기존 거래처 정보 confirm 창
    if (n === 1) {
      const id = selectedIds[0];
      const order = rows.find((r) => r.id === id);
      if (!order) return;

      const ok = window.confirm(buildVendorConfirm(order));
      if (!ok) return;

      markSent(id);
      clear();
      return;
    }

    // 2건 이상이면: "몇개 전송" 안내 confirm
    const ok = window.confirm(`${n}개가 전송되어집니다. 진행할까요?`);
    if (!ok) return;

    bulkMarkSent(selectedIds);
    clear();
  };

  return (
    <div className='flex items-center gap-2'>
      <Button disabled={!hasSelection} onClick={onBulkSend}>
         <SendIcon className='w-4 h-4' />
        선택 전송
      </Button>

      <Button variant='secondary' onClick={clear} disabled={!hasSelection}>
        
        선택 해제
      </Button>

    </div>
  );
};
