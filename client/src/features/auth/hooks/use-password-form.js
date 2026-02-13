// @ts-check

import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { passwordBase } from '@/features/auth/schemas/auth-schema.js';
import { api, hooks } from '@/services/api.js';
import { toast } from 'sonner';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '기존 비밀번호를 입력해주세요.'),
    newPassword: passwordBase,
    confirmPassword: z.string().min(1, '새 비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '새 비밀번호가 일치하지 않습니다.',
  });

export const usePasswordForm = () => {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        /** @type {ApiResponse<void>} */
        const response = await api
          .patch('user/change-password', { json: value, hooks })
          .json();

        if (!response.success) return { success: false };
        console.log(value);
        toast.success(response.message);
        form.reset();
        return { success: true };
      } catch (err) {
        if (err instanceof HTTPError) {
          const errResponse = await err.response.json()
            .catch(e => null);
          toast.error(
            errResponse?.message
              || ERROR.UNEXPECTED_ERROR
          );
          return { success: false };
        }

        toast.error(ERROR.SERVER_ERROR);
        return { success: false };
      }
    },
  });

  return form;
};
