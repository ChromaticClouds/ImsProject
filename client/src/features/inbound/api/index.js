import { api, hooks } from '@/services/api.js';

/**
 * 입고 - pending summary
 * @param {{ from: string, to: string, keyword?: string, page?: number, size?: number }} params
 */
export async function fetchInboundPendingSummary(params) {
  return await api
    .get('api/inbounds/pending/summary', { searchParams: params })
    .json();
}

/**
 * 입고 - pending items
 * @param {string} orderNumber
 */
export async function fetchInboundPendingItems(orderNumber) {
  return await api
    .get(`api/inbounds/pending/${encodeURIComponent(orderNumber)}/items`)
    .json();
}

/**
 * 입고 - pending detail
 * @param {string} orderNumber
 */
export async function fetchInboundPendingDetail(orderNumber) {
  return await api
    .get(`api/inbounds/pending/${encodeURIComponent(orderNumber)}`)
    .json();
}

/**
 * 입고 - pending update
 * @param {string} orderNumber
 * @param {any} data
 */
export async function updateInboundPending(orderNumber, data) {
  return await api
    .patch(`api/inbounds/pending/${encodeURIComponent(orderNumber)}`, { json: data })
    .json();
}

/**
 * 입고 - complete by order id
 * @param {number} orderId
 */
export async function completeInboundOrder(orderId) {
  return await api
    .patch(`api/inbounds/orders/${encodeURIComponent(orderId)}/complete`)
    .json();
}

/**
 * 입고 - complete by order number
 * @param {string} orderNumber
 * @param {{ memo?: string, receivedAt?: string }=} body
 */
export async function completeInboundByOrderNumber(orderNumber, body) {
  return await api
    .patch(`api/inbounds/orders/by-number/${encodeURIComponent(orderNumber)}/complete`, {
      json: body ?? {},
      hooks,
    })
    .json();
}

/**
 * 입고 - completed today summary
 * @param {{ keyword?: string, page?: number, size?: number }} params
 */
export async function fetchInboundCompletedTodaySummary(params) {
  return await api
    .get('api/inbounds/completed/today/summary', {
      searchParams: {
        keyword: params?.keyword ?? '',
        page: String(params?.page ?? 0),
        size: String(params?.size ?? 20),
      },
    })
    .json();
}

/**
 * 입고 - completed items
 * @param {string} orderNumber
 */
export async function fetchInboundCompletedItems(orderNumber) {
  return await api
    .get(`api/inbounds/completed/${encodeURIComponent(orderNumber)}/items`)
    .json();
}

// 안전재고
/**
 * @param {number[]} productIds
 */
export async function fetchInboundSafetyStocks(productIds) {
  const sp = new URLSearchParams();
  for (const id of productIds) sp.append('productIds', String(id));
  return await api.get(`api/inbounds/safeStock?${sp.toString()}`).json();
}