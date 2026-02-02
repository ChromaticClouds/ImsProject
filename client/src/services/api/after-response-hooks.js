import { refreshToken } from '@/features/auth/api/index.js';

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
      useAuthStore.getState().logout();
      return response;
    }

    try {
      const { data } = await refreshToken();
      const { token } = data;
      useAuthStore.getState().setAccessToken(token);

      const retryRequest = request.clone();
      retryRequest.headers.set('Authorization', `Bearer ${token}`);

      return fetch(retryRequest);
    } catch (err) {
      useAuthStore.getState().logout();
      return response;
    }
  },
];
