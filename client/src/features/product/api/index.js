import { api, hooks } from '@/services/api.js';

/**
 * @param {SearchProduct} condition
 * @returns {Promise<ApiResponse<PageResponse<Product>>>}
 */
export const fetchProducts = (condition) =>
  api.get('product', { searchParams: condition, hooks }).json();

/**
 * 카테고리를 가져오는 API 함수
 * @returns {Promise<ApiResponse<CategoriesType>>}
 */
export const getCategories = () => 
  api.get('product/categories', { hooks }).json();