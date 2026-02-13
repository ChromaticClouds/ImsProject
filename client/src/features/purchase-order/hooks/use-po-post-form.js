// @ts-check

import { formatToIsoDate } from '@/features/receive-order/utils/format-date.js';
import { api, hooks } from '@/services/api.js';
import { ERROR } from '@/services/error.js';
import { useForm } from '@tanstack/react-form';
import { HTTPError } from 'ky';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';

const defaultValues = {
  date: new Date(),
  supplierId: null,
  products: [],
};

const productCountSchema = z
  .object({
    id: z.number(),
    vendorItemId: z.number(),
    name: z.string(),
    brand: z.string(),
    type: z.string(), // enum이면 z.nativeEnum
    salePrice: z.number(),
    imageUrl: z.string().nullable(),
    count: z.number().int().min(1, '입력 개수는 최소 1개 이상이어야 합니다.'),
  })
  .loose();

const poPostSchema = z.object({
  date: z.date(),
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
  const navigate = useNavigate();

  const form = useForm({
    /** @type {PoPostFormValues} */
    defaultValues,
    validators: {
      onChange: poPostSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formatForm = { ...value, date: formatToIsoDate(value.date) };

        console.log(formatForm);

        const response = await api.post(
          'purchase/order/post', { json: formatForm, hooks }
        ).json();

        if (!response?.success) return;
        toast.success(response?.message);
        form.reset();
        navigate('/dashboard/purchase-order');
      } catch (err) {
        if (err instanceof HTTPError) {
          const errResponse = await err.response.json();

          return toast.error(
            typeof errResponse?.message === 'string'
              ? errResponse?.message
              : ERROR.UNEXPECTED_ERROR
          );
        }

        toast.error(ERROR.SERVER_ERROR);
      }
    },
  });

  return form;
};
