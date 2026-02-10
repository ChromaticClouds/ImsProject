import { api, hooks } from "@/services/api.js";

/**
 * History
 * @param {{ from:string, to:string, q?:string, kind?:string, targetId?:number, status?:string, type?:string, brand?:string, page?:number, size?:number }} params
 */
export async function fetchHistoryLots(params) {
  return await api.get('api/history/lots', { searchParams: params }).json();
}

/** @param {number} lotId */
export async function fetchHistoryLotDetail(lotId) {
  return await api.get(`api/history/lots/${encodeURIComponent(lotId)}`).json();
}

/** @param {string} q */
export async function fetchHistorySearch(q) {
  return await api.get('api/history/search', { searchParams: { q } }).json();
}

/** @param {string} type */
export async function fetchHistoryBrands(type) {
  return await api.get('api/history/brands', { searchParams: { type } }).json();
}

// 기간 설정을 위함(최소)
export async function fetchHistoryMinDate() {
  return await api.get('api/history/min-date').json(); 
}

