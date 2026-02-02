// @ts-check

import { useAuthStore } from '../stores/use-auth-store.js';

export const useLogOut = () => {
  
  const clearAuth = useAuthStore((s) => s.clearAuth);
};
