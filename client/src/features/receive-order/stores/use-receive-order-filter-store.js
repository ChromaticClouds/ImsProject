// @ts-check

import { create } from 'zustand';

/**
 * @typedef {Object} ReceiveOrderFilterState
 * @property {AppDateRange} dateRange
 * @property {string | null} search
 * @property {number | null} salerId
 */

/**
 * @typedef {import('react-day-picker').DateRange} AppDateRange
 */

/**
 * @typedef {Object} ReceiveOrderFilterActions
 * @property {(search: string | null) => void} setKeyword
 * @property {(dateRange: AppDateRange) => void} setDateRange
 * @property {(salerId: number | null) => void} setSaler
 * @property {(partial: Partial<ReceiveOrderFilterState>) => void} setFilter
 * @property {() => void} reset
 */

/**
 * @typedef {ReceiveOrderFilterState & ReceiveOrderFilterActions} ReceiveOrderFilterStore
 */

/** @type {ReceiveOrderFilterState} */
const defaultValues = {
  dateRange: { from: null, to: null },
  search: null,
  salerId: null,
};

/** 
 * @type {import('zustand').UseBoundStore<
 *   import('zustand').StoreApi<ReceiveOrderFilterStore>
 * >}
 */
export const useReceiveOrderFilterStore = create((set) => ({
  ...defaultValues,

  setKeyword: (search) => set({ search }),

  setDateRange: (dateRange) =>
    set({ dateRange }),

  setSaler: (salerId) => set({ salerId }),

  setFilter: (partial) =>
    set((state) => ({
      ...state,
      ...partial,
    })),

  reset: () => set(defaultValues),
}));
