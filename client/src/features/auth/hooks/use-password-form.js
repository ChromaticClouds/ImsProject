// @ts-check

import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { passwordBase } from '@/features/auth/schemas/auth-schema.js';

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
  return useForm({
    defaultValues,
    validators: {
      onChange: passwordSchema
    },
    onSubmit: ({ value }) => {
      console.log(value);
    }
  });
};
