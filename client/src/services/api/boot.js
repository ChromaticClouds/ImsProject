import { refreshToken } from '@/features/auth/api/index.js';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';
import { api } from '@/services/api.js';
import { toast } from 'sonner';

export const fetchApiHealth = () => api.get('api/health').json();

export const bootStrapAuth = async () => {
  try {
    const { data } = await refreshToken();
    const { user, token } = data;
    useAuthStore.getState().setAuth(user, token);
    return { success: true, role: user.userRole };
  } catch {
    toast.error('세션이 만료됐거나 유효한 접근이 아닙니다.');
    useAuthStore.getState().clearAuth();
    return { success: false, role: null };
  }
};
