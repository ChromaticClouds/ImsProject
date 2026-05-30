// @ts-check

import { useAppForm } from '@/components/form/index.js';
import { useVendorDetail } from '@/features/vendor/hooks/vendor-detail/use-vendor-detail.js';
import { useParams } from 'react-router-dom';
import z from 'zod';

const requiredSchema = z.string().trim().min(1, '필수 입력값입니다.');

const vendorProductSchema = z.object({
  productId: z.number(),
  productName: z.string(),
  purchasePrice: z.number(),
  brand: z.string(),
  type: z.enum(['SOJU', 'WHISKEY', 'LIQUOR', 'TRADITIONAL', 'KAOLIANG_LIQUOR']),
  imageUrl: z.string().optional(),
});

const vendorFormSchema = z
  .object({
    type: z.enum(['Supplier', 'Seller']),
    vendorName: requiredSchema,
    telephone: requiredSchema.pipe(
      z
        .string()
        .regex(
          /^(01[0-9]-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/,
          '전화번호 형식이 올바르지 않습니다',
        ),
    ),
    email: z.email('이메일 형식이 올바르지 않습니다'),
    address: requiredSchema,
    memo: z.string().optional(),
    items: z.array(vendorProductSchema),
  })
  .superRefine((data, ctx) => {
    if (data.type !== 'Supplier') return;

    if (data.items.length < 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['items'],
        message: '공급처는 품목을 최소 1개 이상 등록해야 합니다.',
      });
    }

    data.items.forEach((product, index) => {
      if (
        !Number.isFinite(product.purchasePrice) ||
        Number(product.purchasePrice) <= 0
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['items', index, 'purchasePrice'],
          message: '단가는 1원 이상 입력해야 합니다.',
        });
      }
    });
  });

/**
 * @returns {z.infer<typeof vendorFormSchema>}
 */
const toInitValues = (
  /** @type {import('@/features/vendor/types/index.js').VendorDetailResponse | undefined} */ data,
) =>
  data
    ? {
        type: data.vendor.type,
        vendorName: data.vendor.vendorName,
        telephone: data.vendor.telephone,
        email: data.vendor.email,
        address: data.vendor.address,
        memo: data.vendor.memo,
        items: data.items ?? [],
      }
    : {
        type: 'Supplier',
        vendorName: '',
        telephone: '',
        email: '',
        address: '',
        memo: '',
        items: [],
      };

export const useVendorEditForm = () => {
  const { id } = useParams();
  const { data } = useVendorDetail(id);

  return useAppForm({
    defaultValues: toInitValues(data),
    validators: {
      onMount: vendorFormSchema,
      onChange: vendorFormSchema,
    },
    onSubmit: ({ value, formApi }) => console.log(value),
  });
};
