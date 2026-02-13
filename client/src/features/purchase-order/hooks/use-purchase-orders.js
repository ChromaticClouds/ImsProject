// @ts-check
import { useCallback, useMemo, useState } from 'react';
import {
  fetchPurchaseOrders,
  deletePurchaseOrder,
  sendPurchaseOrder,
  bulkSendPurchaseOrders,
  bulkDeletePurchaseOrders,
} from '@/features/purchase-order/api/index.js';

/**
 * @typedef {{ orderKinds:number, totalCount:number, totalPrice:number }} PurchaseOrderSummary
 */

const EMPTY_SUMMARY = { orderKinds: 0, totalCount: 0, totalPrice: 0 };

export const purchaseOrderStatus = {
  isSent: (status) => status === 'INBOUND_PENDING' || status === 'INBOUND_COMPLETE',
  isDraft: (status) => status == null,
};

/** @param {any} s */
const normalizeSummary = (s) => ({
  orderKinds: Number(s?.orderKinds ?? 0),
  totalCount: Number(s?.totalCount ?? 0),
  totalPrice: Number(s?.totalPrice ?? 0),
});

export const usePurchaseOrders = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState({ number: 1, size: 10, totalElements: 0, totalPages: 1 });
  const [summary, setSummary] = useState(/** @type {PurchaseOrderSummary} */ (EMPTY_SUMMARY));
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (params) => {
    setLoading(true);
    try {
      const data = await fetchPurchaseOrders(params);

      setRows(Array.isArray(data?.content) ? data.content : []);
      setPage(
        data?.page ?? {
          number: params?.page ?? 1,
          size: params?.size ?? 10,
          totalElements: 0,
          totalPages: 1,
        }
      );

      setSummary(normalizeSummary(data?.summary));

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (orderNumber) => {
    await deletePurchaseOrder(orderNumber);
  }, []);

  const markSent = useCallback(async (orderNumber) => {
    await sendPurchaseOrder(orderNumber);
  }, []);

  const bulkMarkSent = useCallback(async (orderNumbers) => {
    await bulkSendPurchaseOrders(orderNumbers);
  }, []);

  const bulkRemove = useCallback(async (orderNumbers) => {
    await bulkDeletePurchaseOrders(orderNumbers);
  }, []);

  // ✅ purchase-order.jsx에서 기존에 쓰던 이름 유지(호환)
  const summaryDraft = useMemo(() => summary, [summary]);
  const summarySent = useMemo(() => summary, [summary]);

  return {
    rows,
    page,
    summary,
    loading,
    load,

    remove,
    markSent,
    bulkMarkSent,
    bulkRemove,

    summaryDraft,
    summarySent,
  };
};
