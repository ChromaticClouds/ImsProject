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
 * @typedef {{
 *  orderNumber: string,
 *  orderDate: string,
 *  recieveDate: string,
 *  status: (null|'INBOUND_PENDING'),
 *  vendorId?: number,
 *  vendorName?: string,
 *  itemKinds?: number,
 *  totalCount?: number,
 *  totalPrice?: number,
 *  items?: Array<{
 *    orderNumber: string,
 *    orderId: number,
 *    vendorItemId: number,
 *    productId: number,
 *    productName?: string,
 *    type?: string,
 *    brand?: string,
 *    count?: number,
 *    purchasePrice?: number,
 *    safetyStock?: number,
 *  }>
 * }} PurchaseOrderGroupRow
 */

/**
 * 
 * @typedef {{
 *   orderKinds: number,
 *   totalCount: number,
 *   totalPrice: number
 * }} PurchaseOrderSummary
 */

/**
 * @typedef {{
 *   number: number,
 *   size: number,
 *   totalElements: number,
 *   totalPages: number
 * }} PageMeta
 */

/**
 * 
 * @typedef {{
 *   content: PurchaseOrderGroupRow[],
 *   page: PageMeta,
 *   summary: PurchaseOrderSummary
 * }} PurchaseOrderListResponse
 */

/**
 * 목록
 * @param {{ view?:'DRAFT'|'SENT', keyword?:string, from?:string, to?:string, page?:number, size?:number }} params
 * @returns {Promise<PurchaseOrderListResponse>}
 */
export async function fetchPurchaseOrders(params) {
  return await api
    .get('api/purchase-orders', { hooks, searchParams: params })
    .json();
}

/**
 * 수정
 * @param {string} orderNumber
 * @returns {Promise<PurchaseOrderGroupRow>}
 */
export async function fetchPurchaseOrder(orderNumber) {
  return await api
    .get(`api/purchase-orders/${encodeURIComponent(orderNumber)}`, { hooks })
    .json();
}

/**
 * 수정
 * @param {string} orderNumber
 * @param {{ recieveDate:string, items:{orderId:number, count:number}[] }} payload
 */
export async function updatePurchaseOrder(orderNumber, payload) {
  return await api
    .patch(`api/purchase-orders/${encodeURIComponent(orderNumber)}`, {
      hooks,
      json: payload,
    })
    .json()
    .catch(() => null);
}

/** 삭제 @param {string} orderNumber */
export async function deletePurchaseOrder(orderNumber) {
  return await api
    .delete(`api/purchase-orders/${encodeURIComponent(orderNumber)}`, { hooks })
    .json()
    .catch(() => null);
}

/** 
 * 전송
 * @param {string} orderNumber 
 * @returns {Promise<ApiResponse<any>>}
 */
export async function sendPurchaseOrder(orderNumber) {
  return await api
    .post(`api/purchase-orders/${encodeURIComponent(orderNumber)}/send`, { hooks })
    .json()
    .catch(() => null);
}

/** 일괄 전송 @param {string[]} orderNumbers */
export async function bulkSendPurchaseOrders(orderNumbers) {
  return await api
    .post('api/purchase-orders/send', { hooks, json: { orderNumbers } })
    .json()
    .catch(() => null);
}

/** 일괄 삭제 @param {string[]} orderNumbers */
export async function bulkDeletePurchaseOrders(orderNumbers) {
  return await api
    .post('api/purchase-orders/delete', { hooks, json: { orderNumbers } })
    .json()
    .catch(() => null);
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
