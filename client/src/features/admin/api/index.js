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
 * @param {number} [page]
 * @param {string} [keyword]
 * @returns {Promise<ApiResponse<PageResponse<User>>>}
 */
export const fetchUserGroup = (page, keyword) =>
  api
    .get('user/group/list', { searchParams: { page, search: keyword }, hooks })
    .json();

/**
 * @param {number} userId
 * @param {{ rank?: string; role?: string, status?: string, name?: string }} body
 */
export const patchUser = (userId, body) =>
  api.patch(`user/permission/${userId}`, { json: body, hooks }).json();

/**
 * 해당 이메일로 이메일 재발송을 넣는 요청 API 함수
 * @param {string} email 
 * @returns {Promise<ApiResponse<void>}
 */
export const resendEmail = (email) =>
  api.post('invitation/single', { json: { email }, hooks }).json();
