// @ts-check

/**
 * Utils
 */
import { create } from 'zustand';
import { subMonths } from 'date-fns';
import { formatToIsoDate } from '@/features/receive-order/utils/format-date.js';

const sixMonthAgo = () => formatToIsoDate(subMonths(new Date(), 6));

const today = () => formatToIsoDate(new Date());

/**
 * @import { UseBoundStore, StoreApi } from 'zustand';
 * 
 * @typedef {{ from: string, to: string }} DateRange
 * 
 * @typedef {object} ClientStoreState
 * @property {DateRange} range
 * @property {'inbound' | 'outbound'} mode
 * @property {(range: DateRange) => void} setRange
 * @property {(mode: 'inbound' | 'outbound') => void} setMode
 */

/** @type {UseBoundStore<StoreApi<ClientStoreState>>} */
export const useClientRankStore = create((set) => ({
  range: { from: sixMonthAgo(), to: today() },
  mode: /** @type {'inbound'|'outbound'} */ ('inbound'),

  setRange: (range) => set({ range }),
  setMode: (mode) => set({ mode }),
}));
