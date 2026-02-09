import { create } from 'zustand';
import { purchaseOrders } from '@/features/purchase-order/mocks/purchase-order-mock.js';

export const usePurchaseOrdersStore = create((set, get) => ({
  rows: purchaseOrders, // ✅ mock을 store에 1번만 올림(공유됨)

  setRows: (rows) => set({ rows }),

  update: (id, patch) =>
    set((state) => ({
      rows: state.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),

  remove: (id) =>
    set((state) => ({
      rows: state.rows.filter((r) => r.id !== id),
    })),

  bulkRemove: (ids) =>
    set((state) => ({
      rows: state.rows.filter((r) => !ids.includes(r.id)),
    })),

  markSent: (id) =>
    set((state) => ({
      rows: state.rows.map((r) =>
        r.id === id ? { ...r, status: 'INBOUND_PENDING' } : r,
      ),
    })),

  bulkMarkSent: (ids) =>
    set((state) => ({
      rows: state.rows.map((r) =>
        ids.includes(r.id) ? { ...r, status: 'INBOUND_PENDING' } : r,
      ),
    })),

  bulkRemove: (ids) =>
    set((state) => ({
      rows: state.rows.filter((r) => !ids.includes(r.id)),
    })),
}));
