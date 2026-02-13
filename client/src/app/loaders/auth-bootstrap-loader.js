// @ts-check

import { bootStrapAuth } from '@/services/api/boot';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';

export const authBootstrapLoader = () => {
  const token = useAuthStore.getState().accessToken;
  const user = useAuthStore.getState().user;

  const authPromise = token
    ? { authenticated: true, role: user.userRole, rank: user.userRank }
    : bootStrapAuth().then((b) => ({
        authenticated: b.success,
        role: b.role,
        rank: b.rank,
      }));

  return Promise.resolve({ auth: authPromise });
};
