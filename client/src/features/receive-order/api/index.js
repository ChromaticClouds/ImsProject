// @ts-check

import { api, hooks } from '@/services/api.js';
import { receiveOrderFormSchema } from '@/features/receive-order/schemas/receive-order-form-schema.js';
import z from 'zod';

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
 * @property {string} orderNumber
 * @property {string} userName
 * @property {string} vendorName
 * @property {string} bossName
 * @property {string} orderDate
 * @property {string} receiveDate
 * @property {number} itemCount
 * @property {number} totalPrice
 * @property {number} managerId
 * @property {string} managerName
 */

/** @param {{ search?: string, fromDate?: string, toDate?: string }} searchCond */
const buildParams = ({ search, fromDate, toDate }) => {
  const params = {};

  if (search) params.search = search;
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;

  return params;
};

/**
 * @param {{ search?: string, fromDate?: string, toDate?: string }} searchCond
 * @returns {Promise<ApiResponse<ReceivedOrder[]>>}
 */
export const getReceiveOrders = (searchCond) => {
  const params = buildParams(searchCond);

  return api
    .get('order/receive', { hooks, searchParams: { ...params } })
    .json();
};

/**
 * @param {string} search
 * @returns {Promise<ApiResponse<OrderPostProduct[]>>}
 */
export const getProductSearchResult = (search) =>
  api.get('order/get-products', { hooks, searchParams: { search } }).json();

/**
 * @param {z.infer<typeof receiveOrderFormSchema>} value
 * @returns {Promise<ApiResponse>}
 */
export const postOrder = (value) =>
  api.post('order/post', { json: value, hooks }).json();

/**
 * @returns {Promise<ApiResponse<UserIdentifier[]>>}
 */
export const fetchOutboundManagers = () =>
  api.get('order/get-managers', { hooks }).json();

/**
 * 출고 담당자 지정/해제
 *
 * @param {{ orderNumber: string, managerId: number | null }} param
 */
export const assignOutboundManager = ({
  orderNumber,
  managerId,
}) => {
  
  return api.patch(`order/${orderNumber}/manager`, { json: { managerId } }).json();
}
