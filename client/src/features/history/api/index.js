import { api } from '@/services/api.js';

/**
 * History
 * @param {HistoryParams} params
 * @returns {Promise<PageResponse<HistoryLotRow>>}
 */
export async function fetchHistoryLots(params) {
  return await api.get('history/lots', { searchParams: params }).json();
}

/**
 * @param {number} lotId
 * @returns {Promise<HistoryLotRow>}
 */
export async function fetchHistoryLotDetail(lotId) {
  return await api.get(`history/lots/${encodeURIComponent(lotId)}`).json();
}

/**
 * @param {string} q
 * @returns {Promise<HistorySearchSuggestion[]>}
 */
export async function fetchHistorySearch(q) {
  return await api.get('history/search', { searchParams: { q } }).json();
}

/**
 * @param {string} type
 * @returns {Promise<string[]>}
 */
export async function fetchHistoryBrands(type) {
  return await api.get('history/brands', { searchParams: { type } }).json();
}

// 기간 설정을 위함(최소)
/** @returns {Promise<{minDate: string}>} */
export async function fetchHistoryMinDate() {
  return await api.get('history/min-date').json();
}
