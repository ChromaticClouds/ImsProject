import { api, hooks } from '@/services/api.js';

/**
 * @param {number} [page]
 * @param {string} [keyword]
 * @returns {Promise<ApiResponse<PageResponse<User>>>}
 */
export const fetchUsers = (page, keyword) =>
  api
    .get('user/list', { searchParams: { page, search: keyword }, hooks })
    .json();

/**
 * @param {number} userId
 * @param {{ rank?: string; role?: string }} body
 */
export const patchUser = (userId, body) =>
  api.patch(`user/${userId}`, { json: body, hooks }).json();
