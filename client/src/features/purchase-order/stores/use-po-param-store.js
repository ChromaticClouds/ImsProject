// @ts-check

import { create } from 'zustand';

/**
 * @import { UseBoundStore, StoreApi } from 'zustand'
 */

/**
 * @typedef {object} PoParamState
 * @property {'DRAFT' | 'SENT'} view
 * @property {number} page
 * @property {number} size
 * @property {() => void} toggleView
 * @property {(view: 'DRAFT' | 'SENT') => void} setView
 * @property {(page: number) => void} setPage
 */

/** @type {UseBoundStore<StoreApi<PoParamState>>} */
export const usePoParamStore = create((set) => ({
  view: 'DRAFT',
  page: 1,
  size: 10,

  toggleView: () =>
    set((prev) => ({
      view: prev.view === 'DRAFT' ? 'SENT' : 'DRAFT',
      page: 1,
    })),

  setView: (view) => set({ view, page: 1 }),
    
  setPage: (page) => set({ page }),
}));
