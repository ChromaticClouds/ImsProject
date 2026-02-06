import { api, hooks } from '@/services/api.js';

/**
 * @param {SearchProduct} condition
 * @returns {Promise<ApiResponse<PageResponse<Product>>>}
 */
export const fetchProducts = (condition) =>
  api.get('product', { searchParams: condition, hooks }).json();
