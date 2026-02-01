// @ts-check

import { create } from 'zustand';

/**
 * @typedef {object} AuthState
 * @property {User | null} user
 * @property {string | null} accessToken
 * @property {(user: User, token: string) => void} setAuth
 * @property {() => void} clearAuth
 */

/**
 * @type {import("zustand").UseBoundStore<import("zustand").StoreApi<AuthState>>}
 */
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,

  setAuth: (user, token) =>
    set({
      user,
      accessToken: token,
    }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));
