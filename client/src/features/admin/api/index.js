import { api, hooks } from '@/services/api.js';

/**
 * @param {number} page
 * @returns {Promise<ApiResponse<PageResponse<User>>>}
 */
export const fetchUsers = (page) =>
  api.get(`user/list?page=${page}`, { hooks }).json();
