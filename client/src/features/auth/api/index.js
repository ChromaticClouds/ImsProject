/**
 * Node modules
 */
import { api } from '@/services/api.js';

/**
 * @param {LoginFormSchema} loginForm
 * @return {Promise<ApiResponse<AuthResponse>>}
 */
export const loginUser = (loginForm) =>
  api.post('auth/login', { json: loginForm }).json();

/**
 * @param {RegisterFormSchema} registerForm
 * @return {Promise<ApiResponse<AuthResponse>>}
 */
export const registerUser = (registerForm) =>
  api.post('auth/register', { json: registerForm }).json();
