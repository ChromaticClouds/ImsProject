import { create } from 'zustand';

export const usePurchaseOrdersStore = create((set) => ({
  /** @type {any[]} */
  rows: [],
  page: { number: 1, size: 10, totalElements: 0, totalPages: 1 },

  setResult: (res) =>
    set({
      rows: Array.isArray(res?.content) ? res.content : [],
      page: res?.page ?? { number: 1, size: 10, totalElements: 0, totalPages: 1 },
    }),
}));
