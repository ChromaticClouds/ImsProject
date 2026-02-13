

import { create } from 'zustand';

export const usePurchaseOrderFilterStore = create((set) => ({
  range: { from: null, to: null }, // Date|null
  view: 'DRAFT', // 'DRAFT'|'SENT'
  keyword: '',

  setRange: (range) => set({ range }),
  setView: (view) => set({ view }),
  setKeyword: (keyword) => set({ keyword }),
}));
