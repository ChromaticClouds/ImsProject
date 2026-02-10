import { api, hooks } from "@/services/api.js";


/**
 * 통계 - 주종 목록
 */
export async function fetchStatisticsTypes() {
  return await api.get('api/statistics/types').json();
}

/**
 * 통계 - 브랜드 목록 (type 필요)
 * @param {{ type: string }} params
 */
export async function fetchStatisticsBrands(params) {
  return await api.get('api/statistics/brands', { searchParams: params }).json();
}

/**
 * 통계 - 품목별 입출고
 * @param {{ from: string, to: string, keyword?: string, type?: string, brand?: string, limit?: number }} params
 */
export async function fetchStatisticsInOutByProduct(params) {
  return await api.get('api/statistics/in-out/by-product', { searchParams: params }).json();
}

// 거래처 순위 통계
export async function fetchInboundPartnerRank(params) {
  return await api.get('api/statistics/rank/inbound', { searchParams: params }).json();
}

export async function fetchOutboundPartnerRank(params) {
  return await api.get('api/statistics/rank/outbound', { searchParams: params }).json();
}

