// @ts-check

import { useAppForm } from '@/components/form/index.js';
import { useUpdateVendor } from '@/features/vendor/hooks/use-update-vendor.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
    bossName: requiredSchema,
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
        bossName: data.vendor.bossName ?? '',
        address: data.vendor.address,
        memo: data.vendor.memo ?? '',
        items: data.items ?? [],
      }
    : {
        type: 'Supplier',
        vendorName: '',
        telephone: '',
        email: '',
        bossName: '',
        address: '',
        memo: '',
        items: [],
      };

const toPayload = (/** @type {z.infer<typeof vendorFormSchema>} */ value) => ({
  type: value.type,
  vendorName: value.vendorName.trim(),
  telephone: value.telephone.trim(),
  email: value.email.trim(),
  bossName: value.bossName.trim(),
  address: value.address.trim(),
  memo: value.memo?.trim() || null,
  items:
    value.type === 'Supplier'
      ? value.items.map(({ productId, purchasePrice }) => ({
          productId,
          purchasePrice,
        }))
      : [],
});

/**
 * @param {number} id
 * @param {import('@/features/vendor/types/index.js').VendorDetailResponse} data
 */
export const useVendorEditForm = (id, data) => {
  const navigate = useNavigate();
  const { mutateAsync } = useUpdateVendor();

  return useAppForm({
    defaultValues: toInitValues(data),
    validators: {
      onMount: vendorFormSchema,
      onChange: vendorFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({ id, payload: toPayload(value) });
        toast.success('거래처가 수정되었습니다.');
        navigate(`/dashboard/vendor/${id}`);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : '수정 중 오류가 발생했습니다.',
        );
      }
    },
  });
};
