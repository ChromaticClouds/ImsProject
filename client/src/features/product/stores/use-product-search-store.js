// @ts-check

import { create } from 'zustand';

/**
 * @typedef ProductSearchState
 * @property {boolean} isOpen
 * @property {(isOpen: boolean) => void} setIsOpen
 */

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ProductSearchState>>}
 */
export const useProductSearchStore = create((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
