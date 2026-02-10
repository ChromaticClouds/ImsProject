// @ts-check

import { passwordBase } from '@/features/auth/schemas/auth-schema.js';
import { useForm } from '@tanstack/react-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import z from 'zod';
import { postPasswordRequest } from '../api/index.js';
import { toast } from 'sonner';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';

const defaultValues = {
  newPassword: '',
  confirmPassword: '',
};

const passwordSchema = z
  .object({
    newPassword: passwordBase,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '새 비밀번호가 일치하지 않습니다.',
  });

export const usePasswordResetForm = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const form = useForm({
    defaultValues,
    validators: {
      onChange: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const values = { ...value, token: params.get('token') };

        const response = await postPasswordRequest(values);
        if (!response.success) return;
        toast.success(response.message);
        form.reset();
        navigate('/login');
      } catch (err) {
        if (err instanceof HTTPError) {
          const errResponse = await err.response.json().catch(() => null);

          return toast.error(
            typeof errResponse?.message === 'string'
              ? errResponse.message
              : ERROR.UNEXPECTED_ERROR,
          );
        }

        toast.error(ERROR.SERVER_ERROR);
      }
    },
  });

  return form;
};
