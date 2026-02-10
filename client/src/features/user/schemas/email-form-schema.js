import z from 'zod';

export const emailFormSchema = z.object({
  email: z.email('유효한 이메일 형식이 아닙니다.'),
});
