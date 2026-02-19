// @ts-check

import { api, hooks } from "@/services/api.js";

/**
 * 통계 - 주종 목록
 */
export async function fetchStatisticsTypes() {
  return await api.get('stats/types').json();
}

/**
 * 통계 - 브랜드 목록 (type 필요)
 * @param {{ type: string }} params
 */
export async function fetchStatisticsBrands(params) {
  return await api.get('stats/brands', { searchParams: params }).json();
}

/**
 * 통계 - 품목별 입출고
 * @param {{ from: string, to: string, keyword?: string, type?: string, brand?: string, limit?: number }} params
 */
export async function fetchStatisticsInOutByProduct(params) {
  return await api.get('stats/in-out/by-product', { searchParams: params }).json();
}

// 거래처 순위 통계
export async function fetchInboundPartnerRank(params) {
  return await api.get('stats/rank/inbound', { searchParams: params }).json();
}

export async function fetchOutboundPartnerRank(params) {
  return await api.get('stats/rank/outbound', { searchParams: params }).json();
}

/**
 * @typedef {{
 *   usedVolume: number
 *   totalVolume: number
 * }} WarehouseShareResponse
 */

/**
 * @returns {Promise<ApiResponse<WarehouseShareResponse>>}
 */
export const getWarehouseShare = () =>
  api.get('stats/by-warehouse').json();

/**
 * @typedef {{
 *   item: string
 *   stock: number
 *   volume: number
 * }} ProductShareResponse
 */

/**
 * @returns {Promise<ApiResponse<ProductShareResponse[]>>}
 */
export const getProductShare = () =>
  api.get('stats/by-product').json();

export const getLeadTimeStats = () =>
  api.get('stats/lead-time').json();

// --------------------------------------------------------------
// 품목별 수량 그래프

// /** @typedef {{ type?: string, unsafeOnly?: boolean, limit?: number }} StockByProductParams */

// export async function fetchStatisticsStockByProduct(params) {
//   return await api.get('stats/stock/by-product', { searchParams: params, hooks }).json();
// }

/** @typedef {{ type?: string, unsafeOnly?: boolean, limit?: number }} StockByProductParams */

/** @param {StockByProductParams & { type?: string }} params */
export async function fetchStatisticsStockByProduct(params) {
  const normalized = {
    ...params,
    // shadcn Select에서 전체값을 'ALL'로 쓰는 경우 서버에는 type을 안 보냄
    type: params?.type && params.type !== 'ALL' ? params.type : undefined,
  };

  return await api
    .get('stats/stock/by-product', { searchParams: normalized, hooks })
    .json();
}

// ---------------------------------------------------------------------
// 재고 회전율

/** @typedef {{ year: number, month?: number, productId: number }} StockRotationTrendParams */

export async function fetchStatisticsStockRotationTrend(params) {
  return await api.get('stats/stock-rotation/trend', { searchParams: params, hooks }).json();
}

/** @typedef {{ keyword: string, limit?: number }} StatisticsSearchProductsParams */


/** @param {StatisticsSearchProductsParams} params */
export async function fetchStatisticsSearchProducts(params) {
  return await api
    .get('stats/stock-rotation/products/search', { searchParams: params, hooks })
    .json();
}

/**
 * @typedef {Object} LeadTimeData
 * @property {string} name
 * @property {number} leadTime
 */

/**
 * 거래처별 리드타임
 * @param {{ startDate: string, endDate: string }} date
 * @returns {Promise<ApiResponse<LeadTimeData[]>>}
 */
export const getVendorLeadTime = (date) =>
  api.get('stats/lead-time/by-vendor', { searchParams: date, hooks }).json();

/**
 * 품목별 리드타임
 * @param {{ startDate: string, endDate: string }} date
 * @returns {Promise<ApiResponse<LeadTimeData[]>>}
 */
export const getProductLeadTime = (date) =>
  api.get('stats/lead-time/by-product', { searchParams: date, hooks }).json();
