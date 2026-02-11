// @ts-check

import { create } from 'zustand';

/**
 * @typedef {object} LeadTimeFilter
 * @property {'vendor' | 'product'} searchType
 * @property {string} startDate
 * @property {string} endDate
 */

/**
 * @typedef {object} LeadTimeStore
 * @property {LeadTimeFilter} filter
 * @property {(type: 'vendor' | 'product') => void} setSearchType
 * @property {(startDate: string, endDate: string) => void} setDateRange
 * @property {(days: number) => void} setLastDays
 * @property {() => void} resetFilter
 */

/** @param {Date} date */
const formatDate = (date) => date.toISOString().slice(0, 10);

/** @returns {LeadTimeFilter} */
const getDefaultFilter = () => {
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 30);

  return {
    searchType: 'vendor',
    startDate: formatDate(start),
    endDate: formatDate(today),
  };
};

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<LeadTimeStore>>} */
export const useLeadTimeFilterStore = create((set) => ({
  filter: getDefaultFilter(),

  // 🔹 거래처 / 품목 변경
  setSearchType: (type) =>
    set((state) => ({
      filter: {
        ...state.filter,
        searchType: type,
      },
    })),

  // 🔹 날짜 직접 설정
  setDateRange: (startDate, endDate) =>
    set((state) => ({
      filter: {
        ...state.filter,
        startDate,
        endDate,
      },
    })),

  // 🔹 30일 / 60일 / 180일 버튼용
  setLastDays: (days) => {
    const today = new Date()
    const start = new Date()
    start.setDate(today.getDate() - days)

    set((state) => ({
      filter: {
        ...state.filter,
        startDate: formatDate(start),
        endDate: formatDate(today),
      },
    }))
  },

  resetFilter: () =>
    set({
      filter: getDefaultFilter(),
    }),
}))

