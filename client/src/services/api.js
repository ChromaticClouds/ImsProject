// // @ts-check

import ky from 'ky';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';
import { afterResponseHooks } from '@/services/api/after-response-hooks.js';

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
  afterResponse: afterResponseHooks,
};

export const api = ky.create({
  prefixUrl: '/api',
  timeout: 30000,
  credentials: 'include',
  retry: 0,
  hooks,
});
