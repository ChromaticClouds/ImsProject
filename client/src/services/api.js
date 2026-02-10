// // @ts-check

import ky from 'ky';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';
import { afterResponseHooks } from '@/services/api/after-response-hooks.js';

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_SERVER_URL,
  timeout: 30000,
  credentials: 'include',
  retry: 0,
}); // 기본 API 클라이언트

/** @type {import('ky').Hooks} */
export const hooks = {
  beforeRequest: [
    (request) => {
      const accessToken = useAuthStore.getState().accessToken;

      if (accessToken) {
        request.headers.set('Authorization', `Bearer ${accessToken}`);
      }
    },
  ],
  afterResponse: afterResponseHooks
}












