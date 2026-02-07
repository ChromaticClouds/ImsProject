// src/features/purchase-order/stores/use-purchase-order-filter-store.js
import { useMemo, useState } from 'react';

export const usePurchaseOrderFilterStore = () => {
  const [range, setRange] = useState({ from: null, to: null });
  const [view, setView] = useState('DRAFT'); // DRAFT | SENT
  const [keyword, setKeyword] = useState('');

  const filterFn = useMemo(() => {
    const toISO = (d) => {
      if (!d) return '';
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const fromISO = toISO(range?.from);
    const toISOv = toISO(range?.to);

    return (r) => {
      // status 필터 (null=전송전 / INBOUND_PENDING=전송완료)
      if (view === 'DRAFT' && r.status != null) return false;
      if (view === 'SENT' && r.status !== 'INBOUND_PENDING') return false;

      // 날짜 필터: 발주일(orderDate)
      if (fromISO && r.orderDate < fromISO) return false;
      if (toISOv && r.orderDate > toISOv) return false;

      // 검색: 발주번호 / sellerVendorId / productId
      if (keyword?.trim()) {
        const k = keyword.trim().toLowerCase();
        const target = `${r.orderNumber} ${r.sellerVendorId} ${r.productId}`.toLowerCase();
        if (!target.includes(k)) return false;
      }

      return true;
    };
  }, [range, view, keyword]);

  return { range, setRange, view, setView, keyword, setKeyword, filterFn };
};
