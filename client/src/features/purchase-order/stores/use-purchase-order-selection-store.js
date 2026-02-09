// src/features/purchase-order/stores/use-purchase-order-selection-store.js
import { create } from 'zustand';

export const usePurchaseOrderSelectionStore = create((set, get) => ({
  selectedIds: [],

  toggle: (id, checked) =>
    set((state) => {
      const exists = state.selectedIds.includes(id);

      if (checked && !exists) {
        return { selectedIds: [...state.selectedIds, id] };
      }

      if (!checked && exists) {
        return { selectedIds: state.selectedIds.filter((x) => x !== id) };
      }

      return state;
    }),

  clear: () => set({ selectedIds: [] }),

  isSelected: (id) => get().selectedIds.includes(id),
}));
