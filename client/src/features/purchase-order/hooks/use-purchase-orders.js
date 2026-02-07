// src/features/purchase-order/hooks/use-purchase-orders.js
import { useEffect, useMemo, useState } from 'react';
import { fetchPurchaseOrders } from '@/features/purchase-order/api/purchase-order-api.js';

const isSent = (status) => status === 'INBOUND_PENDING'; // 전송 완료
const isDraft = (status) => status == null; // 전송 전 (null)

const calcSummary = (rows) => {
  const itemKinds = rows.length; // 발주 건수
  const totalCount = rows.reduce((acc, r) => acc + Number(r.count || 0), 0);
  return { itemKinds, totalCount };
};

export const usePurchaseOrders = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchPurchaseOrders().then(setRows).catch(console.error);
  }, []);

  const api = useMemo(() => {
    const update = (id, patch) =>
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

    const remove = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

    const bulkRemove = (ids) =>
      setRows((prev) => prev.filter((r) => !ids.includes(r.id)));

    const markSent = (id) => update(id, { status: 'INBOUND_PENDING' });

    const bulkMarkSent = (ids) =>
      setRows((prev) =>
        prev.map((r) => (ids.includes(r.id) ? { ...r, status: 'INBOUND_PENDING' } : r))
      );

    return { update, remove, bulkRemove, markSent, bulkMarkSent };
  }, []);

  const summaryDraft = useMemo(
    () => calcSummary(rows.filter((r) => isDraft(r.status))),
    [rows]
  );
  const summarySent = useMemo(
    () => calcSummary(rows.filter((r) => isSent(r.status))),
    [rows]
  );

  return { rows, setRows, summaryDraft, summarySent, ...api };
};

export const purchaseOrderStatus = { isSent, isDraft };
