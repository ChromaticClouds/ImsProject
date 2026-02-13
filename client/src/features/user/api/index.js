import { api } from '@/services/api.js';

/**
 * 잊어버린 비밀번호를 찾기 위해 이메일을 전송하는 패치 함수
 * @param {{ email: string }} value
 * @returns {Promise<ApiResponse<void>>}
 */
export const sendEmail = (value) =>
  api.post('user/forgot-password', { json: value }).json();

/**
 * URL 쿼리의 패스워드 리셋 토큰 검증
 * @param {string} token
 * @returns {Promise<ApiResponse<any>>}
 */
export const verifyPasswordResetToken = (token) =>
  api.get('user/password-reset', { searchParams: { token } }).json();
