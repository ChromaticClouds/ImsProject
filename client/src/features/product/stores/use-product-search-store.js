// @ts-check

import { create } from 'zustand';

/**
 * @typedef ProductSearchState
 * @property {string} keyword
 * @property {(keyword: string) => void} setKeyword
 * @property {boolean} isOpen
 * @property {(isOpen: boolean) => void} setIsOpen
 */

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ProductSearchState>>}
 */
export const useProductSearchStore = create((set) => ({
  keyword: '',
  setKeyword: (keyword) => set({ keyword }),
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
