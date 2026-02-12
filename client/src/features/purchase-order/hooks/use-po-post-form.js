// @ts-check

import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import z from 'zod';

const defaultValues = {
  supplierId: null,
  products: [],
};

const productCountSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    brand: z.string(),
    type: z.string(), // enum이면 z.nativeEnum
    salePrice: z.number(),
    imageUrl: z.string().nullable(),
    count: z.number().int().min(1, '입력 개수는 최소 1개 이상이어야 합니다.'),
  })
  .loose();

const poPostSchema = z.object({
  supplierId: z
    .number()
    .nullable()
    .refine((v) => v !== null, {
      message: '공급처를 선택해주세요',
    }),
  products: z
    .array(productCountSchema)
    .min(1, '상품을 최소 1개 이상 추가해주세요'),
});

/** @typedef {z.infer<typeof poPostSchema>} PoPostFormValues */

export const usePoPostForm = () => {
  const form = useForm({
    /** @type {PoPostFormValues} */
    defaultValues,
    validators: {
      onChange: poPostSchema,
    },
    onSubmit: ({ value }) => {
      toast(JSON.stringify(value));
    },
  });

  return form;
};
