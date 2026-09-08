// @ts-check

import { api, hooks } from "@/services/api.js";

/**
 * 통계 - 주종 목록
 */
export async function fetchStatisticsTypes() {
  return await api.get('stats/types').json<[ProductType]>();
}

/**
 * 통계 - 브랜드 목록 (type 필요)
 * @param {{ type: string }} params
 */
export async function fetchStatisticsBrands(params: { type: string }) {
  return await api.get('stats/brands', { searchParams: params }).json();
}

/**
 * 통계 - 품목별 입출고
 * @param {{ from: string, to: string, keyword?: string, type?: string, brand?: string, limit?: number }} params
 */
export async function fetchStatisticsInOutByProduct(params: {
  from: string;
  to: string;
  keyword?: string;
  type?: string;
  brand?: string;
  limit?: number;
}) {
  return await api.get('stats/in-out/by-product', { searchParams: params }).json();
}

export type ClientRankData = { name: string; qty: number };
type PartnerRankParams = { from: string; to: string; limit?: number };

export async function fetchInboundPartnerRank(params: PartnerRankParams) {
  return await api
    .get('stats/rank/inbound', { searchParams: params })
    .json<ClientRankData[]>();
}

/**
 * @returns {Promise<ClientRankData[]>}
 */
export async function fetchOutboundPartnerRank(params: PartnerRankParams) {
  return await api
    .get('stats/rank/outbound', { searchParams: params })
    .json<ClientRankData[]>();
}

export type WarehouseShareResponse = {
  usedVolume: number;
  totalVolume: number;
};

/**
 * @returns {Promise<ApiResponse<WarehouseShareResponse>>}
 */
export const getWarehouseShare = () =>
  api.get('stats/by-warehouse').json<ApiResponse<WarehouseShareResponse>>();

export type ProductShareResponse = {
  item: string;
  stock: number;
  volume: number;
};

/**
 * @returns {Promise<ApiResponse<ProductShareResponse[]>>}
 */
export const getProductShare = () =>
  api.get('stats/by-product').json<ApiResponse<ProductShareResponse[]>>();

export const getLeadTimeStats = () =>
  api.get('stats/lead-time').json();

// --------------------------------------------------------------
// 품목별 수량 그래프

// /** @typedef {{ type?: string, unsafeOnly?: boolean, limit?: number }} StockByProductParams */

// export async function fetchStatisticsStockByProduct(params) {
//   return await api.get('stats/stock/by-product', { searchParams: params, hooks }).json();
// }

type StockByProductParams = {
  type?: string;
  unsafeOnly?: boolean;
  limit?: number;
};

export async function fetchStatisticsStockByProduct(params: StockByProductParams) {
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

type StockRotationTrendParams = {
  year: number;
  month?: number;
  productId: number;
};

export async function fetchStatisticsStockRotationTrend(params: StockRotationTrendParams) {
  return await api.get('stats/stock-rotation/trend', { searchParams: params, hooks }).json();
}

type StatisticsSearchProductsParams = { keyword: string; limit?: number };

export async function fetchStatisticsSearchProducts(params: StatisticsSearchProductsParams) {
  return await api
    .get('stats/stock-rotation/products/search', { searchParams: params, hooks })
    .json();
}

export type LeadTimeData = { name: string; leadTime: number };

/**
 * 거래처별 리드타임
 * @param {{ startDate: string, endDate: string }} date
 * @returns {Promise<ApiResponse<LeadTimeData[]>>}
 */
export const getVendorLeadTime = (date: { startDate: string; endDate: string }) =>
  api
    .get('stats/lead-time/by-vendor', { searchParams: date, hooks })
    .json<ApiResponse<LeadTimeData[]>>();

/**
 * 품목별 리드타임
 * @param {{ startDate: string, endDate: string }} date
 * @returns {Promise<ApiResponse<LeadTimeData[]>>}
 */
export const getProductLeadTime = (date: { startDate: string; endDate: string }) =>
  api
    .get('stats/lead-time/by-product', { searchParams: date, hooks })
    .json<ApiResponse<LeadTimeData[]>>();
