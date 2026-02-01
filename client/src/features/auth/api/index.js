/**
 * Node modules
 */
import { api } from '@/services/api.js';

/**
 * @param {LoginFormSchema} form
 * @return {Promise<ApiResponse<AuthResponse>>}
 */
export const loginUser = (form) =>
  api.post('auth/login', { json: form }).json();

/**
 * @param {RegisterFormSchema} form
 * @return {Promise<ApiResponse<AuthResponse>>}
 */
export const registerUser = (form) =>
  api.post('auth/register', { json: form }).json();

/**
 * @param {string} token
 * @return {Promise<ApiResponse>}
 */
export const verifyToken = (token) =>
  api.get('invitation/token', { searchParams: { token } }).json();
