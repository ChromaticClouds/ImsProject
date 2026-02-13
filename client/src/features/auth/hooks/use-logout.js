// @ts-check

import { toast } from 'sonner';
import { logout } from '../api/index.js';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';

import { useAuthStore } from '../stores/use-auth-store.js';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();

  return {
    logoutUser: async () => {
      try {
        const response = await logout();
        if (!response) return { success: false };
        useAuthStore.getState().clearAuth();
        toast.success(response.message);
        navigate('/login');
        return { success: true };
      } catch (err) {
        if (err instanceof HTTPError) {
          const errResponse = await err.response.json().catch(() => null);
          toast.error(
            typeof errResponse?.message === 'string'
              ? errResponse.message
              : ERROR.UNEXPECTED_ERROR,
          );

          return { success: false };
        }

        toast.error(ERROR.SERVER_ERROR);
        return { success: false };
      }
    },
  };
};
