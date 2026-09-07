// @ts-check
import { api, hooks } from '@/services/api.js';

/**
 * @typedef {import('ky').Options} KyOptions
 */

/**
 * @typedef {import('@/services/api.js').api} Api
 */

/**
 * @typedef {import('ky').Hooks} Hooks
 */

/**
 * @typedef {import('ky').HTTPError} HTTPError
 */

/**
 * @typedef {import('react').SetStateAction<any>} SetStateAction
 */

/**
 * 목록
 * @param {{ view?:'DRAFT'|'SENT', keyword?:string, from?:string, to?:string, page?:number, size?:number }} params
 * @returns {Promise<OrderResponse>}
 */
export async function fetchPurchaseOrders(params) {
  return await api
    .get('purchase-orders', { hooks, searchParams: params })
    .json();
}

/**
 * 수정
 * @param {string} orderNumber
 * @returns {Promise<OrderRequest>}
 */
export async function fetchPurchaseOrder(orderNumber) {
  return await api
    .get(`purchase-orders/${encodeURIComponent(orderNumber)}`, { hooks })
    .json();
}

/**
 * 수정
 * @param {string} orderNumber
 * @param {{ recieveDate:string, items:{orderId:number, count:number}[] }} payload
 */
export async function updatePurchaseOrder(orderNumber, payload) {
  return await api
    .patch(`purchase-orders/${encodeURIComponent(orderNumber)}`, {
      hooks,
      json: payload,
    })
    .json();
}

/** 삭제 @param {string} orderNumber */
export async function deletePurchaseOrder(orderNumber) {
  return await api
    .delete(`purchase-orders/${encodeURIComponent(orderNumber)}`, { hooks })
    .json();
}

/**
 * 전송
 * @param {string} orderNumber
 * @returns {Promise<ApiResponse<any>>}
 */
export async function sendPurchaseOrder(orderNumber) {
  return await api
    .post(`purchase-orders/${encodeURIComponent(orderNumber)}/send`, { hooks })
    .json();
}

/**
 * @typedef {object} BulkSendFailure
 * @property {string=} orderNumber
 * @property {'LOAD' | 'PDF' | 'MAIL' | 'SEND'=} stage
 *
 * @typedef {object} BulkSendResult
 * @property {number=} successCount
 * @property {number=} failCount
 * @property {number=} total
 * @property {BulkSendFailure[]=} failed
 */

/** 일괄 전송
 * @param {string[]} orderNumbers
 * @returns {Promise<ApiResponse<BulkSendResult>>}
 */
export async function bulkSendPurchaseOrders(orderNumbers) {
  return await api
    .post('purchase-orders/send', { hooks, json: { orderNumbers } })
    .json();
}

/** 일괄 삭제 @param {string[]} orderNumbers */
export async function bulkDeletePurchaseOrders(orderNumbers) {
  return await api
    .post('purchase-orders/delete', { hooks, json: { orderNumbers } })
    .json();
}

/**
 * 공급처와 발주 번호 공급을 받기 위한 API 요청
 * @returns {Promise<ApiResponse<OrderBootstrap>>}
 */
export const poBootstrap = () =>
  api.get('purchase/order/bootstrap', { hooks }).json();

/**
 * @param {number} id
 * @returns {Promise<{ items: [], vendor: VendorDetail }>}
 */
export const fetchSupplier = (id) => api.get(`vendor/${id}`, { hooks }).json();

/**
 *
 * @param {number} id
 * @param {string} keyword
 * @returns {Promise<ApiResponse<OrderSummary[]>>}
 */
export const searchPoProducts = (id, keyword) =>
  api.get(`purchase/order/supplier/${id}/product`, {
    hooks,
    searchParams: { search: keyword },
  }).json();
