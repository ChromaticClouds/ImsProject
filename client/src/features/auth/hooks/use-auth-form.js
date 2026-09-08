// @ts-check

/**
 * Hooks
 */
import { useForm } from '@tanstack/react-form';
import { useAuthMutation } from '@/features/auth/hooks/use-auth-mutation.js';
import { useSearchParams } from 'react-router-dom';

/**
 * Schemas
 */
import {
  loginSchema,
  registerSchema,
} from '@/features/auth/schemas/auth-schema.js';

/**
 * Api
 */
import { loginUser, registerUser } from '@/features/auth/api/index.js';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';
import { toast } from 'sonner';

const registerDefaultValue = {
  name: '',
  password: '',
  confirmPassword: '',
};

const loginDefaultValue = {
  eid: '',
  password: '',
};

/**
 * @param {ApiResponse<AuthResponse>} response
 */
const handleAuthSuccess = (response) => {
  if (!response.data) {
    throw new Error('Authentication response data is missing.');
  }

  const { user, token } = response.data;
  useAuthStore.getState().setAuth(user, token);
  toast.success(response.message);
};

export const useAuthForm = () => {
  const [params] = useSearchParams();
  const token = params.get('token');

  const { mutateAsync: login } = useAuthMutation(loginUser, {
    onSuccess: handleAuthSuccess,
  });

  const { mutateAsync: register } = useAuthMutation(registerUser, {
    onSuccess: handleAuthSuccess,
  });

  return {
    register: useForm({
      defaultValues: registerDefaultValue,
      validators: { onChange: registerSchema },
      onSubmit: async ({ value }) => {
        if (!token) {
          toast.error('유효한 초대 토큰이 필요합니다.');
          return;
        }
        await register({ ...value, token });
      },
    }),
    login: useForm({
      defaultValues: loginDefaultValue,
      validators: { onChange: loginSchema },
      onSubmit: async ({ value }) => {
        await login(value);
      },
    }),
  };
};
