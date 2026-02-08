// @ts-check

import { api, hooks } from "@/services/api.js";

/**
 * @returns {Promise<ApiResponse<{ users: UserIdentifier[], sellers: VendorIdentifier[], sequence: string }>>}
 */
export const getOrderBoostrap = () =>
  api.get('order/bootstrap', { hooks }).json();

/**
 * @typedef {'INBOUND_PENDING' | 'INBOUND_COMPLETE' | 'OUTBOUND_PENDING' | 'OUTBOUND_COMPLETE'} OrderStatus
 */

/**
 * @typedef {object} ReceivedOrder
 * @property {number} id
 * @property {number} orderNumber
 * @property {string} userName
 * @property {number} count
 * @property {string} orderDate
 * @property {string} receiveDate
 * @property {OrderStatus} status 
 */

/**
 * @returns {Promise<ApiResponse<ReceivedOrder[]>>}
 */
export const getReceiveOrders = () =>
  api.get('order/receive', { hooks }).json();

/**
 * @param {string} search
 * @returns {Promise<ApiResponse<OrderPostProduct[]>>}
 */
export const getProductSearchResult = (search) =>
  api.get('order/get-products', { hooks, searchParams: { search } }).json();