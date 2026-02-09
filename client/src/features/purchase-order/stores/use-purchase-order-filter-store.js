// src/features/purchase-order/stores/use-purchase-order-filter-store.js
import { create } from 'zustand';

const toISO = (d) => {
  if (!d) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const usePurchaseOrderFilterStore = create((set, get) => ({
  // 날짜(지금은 주석처리 했어도, 필터는 남겨둠)
  range: { from: null, to: null },

  // DRAFT(전송 전) / SENT(전송 완료)
  view: 'DRAFT',
  keyword: '',

  setRange: (range) => set({ range }),
  setView: (view) => set({ view }),
  setKeyword: (keyword) => set({ keyword }),

  //  리스트에서 rows.filter(filterFn) 하려고 쓰는 함수 제공
  filterFn: (r) => {
    const { range, view, keyword } = get();

    const fromISO = toISO(range?.from);
    const toISOv = toISO(range?.to);

    // status 필터 (null=전송전 / INBOUND_PENDING=전송완료)
    if (view === 'DRAFT' && r.status != null) return false;
    if (view === 'SENT' && r.status !== 'INBOUND_PENDING') return false;

    // 날짜 필터: 발주일(orderDate)
    if (fromISO && r.orderDate < fromISO) return false;
    if (toISOv && r.orderDate > toISOv) return false;

    // 검색: 발주번호 / 거래처ID / 제품ID
    if (keyword?.trim()) {
      const k = keyword.trim().toLowerCase();
      const target = `${r.orderNumber} ${r.sellerVendorId} ${r.productId}`.toLowerCase();
      if (!target.includes(k)) return false;
    }

    

    return true;
  },
}));
