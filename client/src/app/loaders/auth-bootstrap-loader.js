// @ts-check

import { bootStrapAuth } from '@/services/api/boot';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';

export const authBootstrapLoader = () => {
  const token = useAuthStore.getState().accessToken;
  const user = useAuthStore.getState().user;

  const authPromise = token
    ? { authenticated: true, role: user.userRole }
    : bootStrapAuth().then((b) => ({ authenticated: b.success, role: b.role }));

  return Promise.resolve({ auth: authPromise });
};
