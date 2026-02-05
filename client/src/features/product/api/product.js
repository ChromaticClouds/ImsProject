// export const fetchProductList = (params) =>
//   api.get('api/product', { searchParams: params }).json();

import { api, hooks } from '@/services/api';

// export const fetchProductDetail = (id) =>
//   api.get(`api/product/${id}`).json();

// 상품 목록 조회

/**
 * @param {string} search
 * @returns {Promise<PageResponse<Product>>}
 */
export const fetchProducts = (search) =>
  api.get('product', { searchParams: { search }, hooks }).json();

/**
 * @param {string} search
 * @returns {Promise<PageResponse<Product>>}
 */
export const searchProducts = (search) =>
  api.get('product/suggest', { searchParams: { search }, hooks }).json();
