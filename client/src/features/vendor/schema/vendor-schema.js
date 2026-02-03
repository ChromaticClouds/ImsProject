// @ts-check

const phoneRegex = /^(01[0-9]-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/;

import { z } from 'zod';

export const bossNameSchema = z
  .string()
  .trim()
  .min(1, '미입력되었습니다.')
  .min(2, '대표자명은 2~10자만 허용됩니다.')
  .max(10, '대표자명은 2~10자만 허용됩니다.');

export const vendorNameSchema = z.string().trim().min(1, '미입력되었습니다.');

export const phoneSchema = z
  .string()
  .trim()
  .min(1, '미입력되었습니다.')
  .regex(phoneRegex, '전화번호 양식이 올바르지 않습니다 (예: 010-1234-5678)');

export const emailSchema = z
  .string()
  .trim()
  .min(1, '미입력되었습니다.')
  .email('이메일 형식이 맞지 않습니다.');

export const addressSchema = z.string().trim().min(1, '미입력되었습니다.');

const itemSchema = z.object({
  itemId: z.number(),
  itemName: z.string(),
  unitPrice: z.number().optional(),
});

export const vendorFormSchema = z
  .object({
    type: z.enum(['Supplier', 'Seller']),

    vendorName: vendorNameSchema,
    telephone: phoneSchema,
    email: emailSchema,
    bossName: bossNameSchema,
    address: addressSchema,

    memo: z.any(),

    items: z.array(itemSchema),
  })
  .superRefine((data, ctx) => {
    if (data.type !== 'Supplier') return;

    if (data.items.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['items'],
        message: '품목을 최소 1개 이상 선택해야 합니다.',
      });
    }

    data.items.forEach((item, index) => {
      if (!item.unitPrice || item.unitPrice < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['items', index, 'unitPrice'],
          message: '단가는 1원 이상 입력해야 합니다.',
        });
      }
    });
  });
