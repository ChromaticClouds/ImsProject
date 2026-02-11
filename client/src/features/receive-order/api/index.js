// @ts-check

import { api, hooks } from '@/services/api.js';
import { receiveOrderFormSchema } from '@/features/receive-order/schemas/receive-order-form-schema.js';
import z from 'zod';

/**
 * @returns {Promise<ApiResponse<{ users: UserIdentifier[], vendors: VendorIdentifier[], sequence: string }>>}
 */
export const getOrderBootstrap = () =>
  api.get('order/bootstrap', { hooks }).json();

/**
 * @typedef {'INBOUND_PENDING' | 'INBOUND_COMPLETE' | 'OUTBOUND_PENDING' | 'OUTBOUND_COMPLETE'} OrderStatus
 */

/**
 * 수주 내역 항목 Api 상세
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

/** @param {{ search?: string, fromDate?: string, toDate?: string, salerId?: number }} searchCond */
const buildParams = (searchCond) =>
  Object.entries(searchCond).reduce((acc, [key, value]) => {
    if (value != null && value !== '') acc[key] = value;
    return acc;
  }, {});

/**
 * @param {{ search?: string, fromDate?: string, toDate?: string, salerId?: number }} searchCond
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
export const assignOutboundManager = ({ orderNumber, managerId }) => {
  console.log(managerId);
  return api
    .patch(`order/${orderNumber}/manager`, { json: { managerId } })
    .json();
};

/**
 * 판매처 항목
 * @typedef {object} SaleVendor
 * @property {number} id
 * @property {string} name
 */

/**
 * 판매처 항목 리스트 GET 요청
 * @returns {Promise<ApiResponse<SaleVendor[]>>}
 */
export const getSalers = () => api.get('order/get-salers', { hooks }).json();

/**
 * @typedef {object} OrderDetail
 * @property {number} id
 * @property {string} name
 * @property {ProductType} itemType
 * @property {string} brand
 * @property {number} count
 * @property {string} imageUrl
 */

/**
 * 수주 내역 상세 요청
 * @param {string} orderNumber 
 * @returns {Promise<ApiResponse<OrderDetail[]>>}
 */
export const getItemsByOrderNumber = (orderNumber) =>
  api.get(`order/${orderNumber}/items`).json();