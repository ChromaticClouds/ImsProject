// @ts-check
import ky, { HTTPError } from 'ky';

import { refreshToken } from '@/features/auth/api/index.js';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';
import { toast } from 'sonner';
import { ERROR } from '../error.js';

/**
 * @type {import('ky').AfterResponseHook[]}
 */
export const afterResponseHooks = [
  async (request, options, response) => {
    // accessToken 만료
    if (response.status !== 401) {
      return response;
    }

    // refresh 요청 자체면 중단 (무한 루프 방지)
    if (request.url.includes('/auth/refresh')) {
      useAuthStore.getState().clearAuth();
      return response;
    }

    try {
      const { data } = await refreshToken();
      useAuthStore.getState().setAuth(data.user, data.token);

      const retryRequest = request.clone();
      retryRequest.headers.set('Authorization', `Bearer ${data.token}`);

      return ky(retryRequest, { ...options });
    } catch (err) {
      if (err instanceof HTTPError) {
        const errResponse = await err.response.json();

        toast.error(
          typeof errResponse?.message === 'string' 
            ? errResponse?.message
            : ERROR.UNEXPECTED_ERROR
        );
      }

      console.log(err);

      if (err?.response) {
        console.error('status:', err.response.status);
        try {
          const bodyText = await err.response.text();
          console.error('body:', bodyText);
        } catch {}
      }

      useAuthStore.getState().clearAuth();
      return response;
    }
  },
];
