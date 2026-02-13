import { api, hooks } from '@/services/api.js';

export const adjustProducts = (form) =>
  api.post('adjust', { json: form, hooks }).json();

/**
 * 검색 키워드에 따라 조정 대상 품목을 가져옴
 * @param {string} search 
 * @returns {Promise<ApiResponse<ProductSuggest[]>>}
 */
export const getSuggetedProducts = (search) =>
  api.get('product/suggest', { searchParams: { search }, hooks }).json();