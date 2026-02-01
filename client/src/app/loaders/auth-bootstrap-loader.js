// @ts-check

import { bootStrapAuth } from '@/services/api/fetch';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';

export const authBootstrapLoader = () => {
  const token = useAuthStore.getState().accessToken;

  const authPromise = token
    ? { authenticated: true }
    : bootStrapAuth().then((ok) => ({ authenticated: ok }));

  return Promise.resolve({ auth: authPromise });
};
