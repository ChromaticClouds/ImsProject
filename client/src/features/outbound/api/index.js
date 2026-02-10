import { api, hooks } from "@/services/api.js";

/** @typedef {{ from: string, to: string, userId?: number, page?: number, size?: number }} OutboundPendingSummaryParams */
export async function fetchOutboundPendingSummary(params) {
  return await api.get('api/outbounds/pending/summary', { searchParams: params, hooks }).json();
}

/** @param {string} orderNumber */
export async function fetchOutboundPendingItems(orderNumber) {
  return await api.get(`api/outbounds/pending/${encodeURIComponent(orderNumber)}/items`).json();
}

/**
 * @typedef {{ page?: number, size?: number }} OutboundCompletedTodaySummaryParams
 */
export async function fetchOutboundCompletedTodaySummary(params) {
  return await api.get('api/outbounds/completed/today/summary', { searchParams: params }).json();
}

/** @param {string} orderNumber */
export async function fetchOutboundCompletedItems(orderNumber) {
  return await api.get(`api/outbounds/completed/${encodeURIComponent(orderNumber)}/items`).json();
}

/**
 * 출고 완료 (orderNumber)
 * @param {string} orderNumber
 * @param {{ memo?: string }=} body
 */
export const completeOutboundByOrderNumber = async (orderNumber, body = {}) => {
  return await api
    .patch(`api/outbounds/orders/by-number/${encodeURIComponent(orderNumber)}/complete`, {
      json: body,
    })
    .json();
};

export async function fetchOutboundAssignees() {
  return await api.get('api/outbounds/assignees').json();
}

export async function fetchOutboundStockTypes() {
  const res = await api.get('api/outbounds/stock/types').json();
  return res.data;
}

/** @param {{ type: string }} params */
export async function fetchOutboundStockBrands(params) {
  const res = await api.get('api/outbounds/stock/brands', { searchParams: params }).json();
  return res.data;
}

/** @param {{ type: string, brand: string }} params */
export async function fetchOutboundStockProducts(params) {
  const res = await api.get('api/outbounds/stock/products', { searchParams: params }).json();
  return res.data;
}