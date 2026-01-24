/**
 * Hooks
 */
import { useForm } from '@tanstack/react-form';
import { useAuthMutation } from '@/features/auth/hooks/use-auth-mutation.js';

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

export const useAuthForm = () => {
  const { mutate: login } = useAuthMutation(loginUser, {
    onSuccess: (...args) => {
      toast.success(args[0].message);
    },
  });

  const { mutate: register } = useAuthMutation(registerUser, {
    onSuccess: (...args) => {
      toast.success(args[0].message);
    },
  });

  return {
    register: useForm({
      defaultValues: registerDefaultValue,
      validators: { onChange: registerSchema },
      onSubmit: ({ value }) => register(value),
    }),
    login: useForm({
      defaultValues: loginDefaultValue,
      validators: { onChange: loginSchema },
      onSubmit: ({ value }) => login(value),
    }),
  };
};
