import { refreshToken } from "@/features/auth/api/index.js";
import { useAuthStore } from "@/features/auth/stores/use-auth-store.js";
import { api } from "@/services/api.js";
import { toast } from "sonner";

export const fetchApiHealth = () => api.get('api/health').json();

export const bootStrapAuth = async () => {
  try {
    /**
     * @type {ApiResponse<{ user: User, token: string }>}
     */
    const result = await refreshToken();

    useAuthStore
      .getState()
      .setAuth(result.data.user, result.data.token);

    return true;
  } catch {
    toast.error('세션이 만료됐거나 유효한 접근이 아닙니다.');
    useAuthStore.getState().clearAuth();
    return false;
  }
}