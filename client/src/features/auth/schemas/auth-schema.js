import z from 'zod';

export const passwordBase = z
  .string()
  .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.')
  .max(32, '비밀번호는 최대 32자 이하여야 합니다.')
  .regex(/[0-9]/, '숫자를 1개 이상 포함해야 합니다.')
  .regex(/[^A-Za-z0-9]/, '특수문자를 1개 이상 포함해야 합니다.');

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, '이름은 최소 2자리 이상이어야 합니다.')
      .max(10, '이름은 최대 10자리 이하여야 합니다.'),
    password: passwordBase,
    confirmPassword: z.string().min(1, '필드가 비어있습니다.'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export const loginSchema = z.object({
  eid: z.string().min(1, '사원 번호를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});
