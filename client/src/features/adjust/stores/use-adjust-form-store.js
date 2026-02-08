// @ts-check

import { create } from 'zustand';
/**
 * @typedef {object} AdjustFormState
 * @property {import('react-day-picker').DateRange} date
 * @property {(date: import('react-day-picker').DateRange) => void} setDate
 * @property {'PLUS' | 'MINUS'} type
 * @property {(type: 'PLUS' | 'MINUS') => void} setType
 * @property {string} memo
 * @property {(memo: string) => void} setMemo
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<AdjustFormState>>} */
export const useAdjustFormStore = create((set) => ({
  date: { from: null, to: null },
  setDate: (date) => set({ date }),
  type: 'PLUS',
  setType: (type) => set({ type }),
  memo: '',
  setMemo: (memo) => set({ memo }),
}));

