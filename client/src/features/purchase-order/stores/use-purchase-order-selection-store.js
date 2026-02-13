import { create } from 'zustand';

export const usePurchaseOrderSelectionStore = create((set, get) => ({
  selectedOrderNumbers: [],

  toggle: (orderNumber, checked) =>
    set((state) => {
      const exists = state.selectedOrderNumbers.includes(orderNumber);

      if (checked && !exists) {
        return { selectedOrderNumbers: [...state.selectedOrderNumbers, orderNumber] };
      }

      if (!checked && exists) {
        return { selectedOrderNumbers: state.selectedOrderNumbers.filter((x) => x !== orderNumber) };
      }

      return state;
    }),

  clear: () => set({ selectedOrderNumbers: [] }),

  isSelected: (orderNumber) => get().selectedOrderNumbers.includes(orderNumber),
}));
