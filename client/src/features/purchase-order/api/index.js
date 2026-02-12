import { api, hooks } from '@/services/api.js';

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
