import z from 'zod';

export const productAmountSchema = z.object({
  amount: z
    .number('숫자를 입력해주세요')
    .int('정수를 입력해주세요')
    .positive('수량은 0보다 커야합니다'),
}).loose();

export const receiveOrderFormSchema = z.object({
  userId: z.number()
    .nullable('담당자를 선택해주세요'),

  sellerId: z.number()
    .nullable('판매처를 선택해주세요'),

  receiveDate: z.date('날짜를 선택해주세요')
    .min(new Date(), '과거 날짜는 선택 불가능합니다'),

  products: z
    .array(productAmountSchema)
    .min(1, '발주할 품목을 최소 1개 이상 선택해주세요')
});
