// @ts-check

import z from 'zod';

export const adjustProductSchema = z
  .object({
    adjustCount: z
      .number('숫자만 입력해주세요')
      .int('정수만 입력 가능합니다')
      .min(0, '변동 수량은 음수가 될 수 없습니다')
  })

export const adjustFormSchema = z.object({
  products: z
    .array(adjustProductSchema)
    .min(1, '조정할 품목을 최소 1개 이상 선택해주세요'),
  type: z.enum(['PLUS', 'MINUS']),
  memo: z
    .string()
    .trim()
    .min(1, '조정 사유를 입력해주세요'),
});
