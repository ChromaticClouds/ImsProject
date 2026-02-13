import { useMemo } from 'react';
import { usePurchaseOrdersStore } from '@/features/purchase-order/stores/use-purchase-orders-store.js';

export const purchaseOrderStatus = {
  isSent: (status) => status === 'INBOUND_PENDING',
  isDraft: (status) => status == null,
};

export const usePurchaseOrders = () => {
  const rows = usePurchaseOrdersStore((s) => s.rows);
  const setRows = usePurchaseOrdersStore((s) => s.setRows);
  const update = usePurchaseOrdersStore((s) => s.update);
  const remove = usePurchaseOrdersStore((s) => s.remove);
  const markSent = usePurchaseOrdersStore((s) => s.markSent);
  const bulkMarkSent = usePurchaseOrdersStore((s) => s.bulkMarkSent);
  const bulkRemove = usePurchaseOrdersStore((s) => s.bulkRemove);

  const summaryDraft = useMemo(
    () => ({
      itemKinds: rows.filter((r) => r.status == null).length,
      totalCount: rows
        .filter((r) => r.status == null)
        .reduce((a, r) => a + Number(r.count || 0), 0),
    }),
    [rows]
  );

  const summarySent = useMemo(
    () => ({
      itemKinds: rows.filter((r) => r.status === 'INBOUND_PENDING').length,
      totalCount: rows
        .filter((r) => r.status === 'INBOUND_PENDING')
        .reduce((a, r) => a + Number(r.count || 0), 0),
    }),
    [rows]
  );

  return {
    rows,
    setRows,
    update,
    remove,
    markSent,
    bulkMarkSent,
    summaryDraft,
    summarySent,
    bulkRemove,
  };
};


