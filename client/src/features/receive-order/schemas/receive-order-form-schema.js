// @ts-check

import z from 'zod';
import { subDays } from 'date-fns';

export const productAmountSchema = z
  .object({
    amount: z
      .number('숫자를 입력해주세요')
      .int('정수를 입력해주세요')
      .positive('수량은 0보다 커야합니다'),

    stockCount: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.amount > data.stockCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['amount'],
        message: '재고 수량을 초과할 수 없습니다.',
      });
    }
  })
  .loose();

const yesterday = () => subDays(new Date(), 1);

/** @param {string} msg */
const requiredSelectNumber = (msg) =>
  z.union([z.number(), z.null()]).refine((v) => v !== null, { error: msg });


export const receiveOrderFormSchema = z.object({
  userId: requiredSelectNumber('담당자를 선택해주세요'),

  sellerId: requiredSelectNumber('판매처를 선택해주세요'),

  receiveDate: z
    .date('날짜를 선택해주세요')
    .min(yesterday(), '과거 날짜는 선택 불가능합니다'),

  products: z
    .array(productAmountSchema)
    .min(1, '발주할 품목을 최소 1개 이상 선택해주세요'),
});
