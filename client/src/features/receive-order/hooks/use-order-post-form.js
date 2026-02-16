// @ts-check
import z from 'zod';

/**
 * Hooks
 */
import { useForm } from '@tanstack/react-form';

/**
 * Schema
 */
import { receiveOrderFormSchema } from '../schemas/receive-order-form-schema.js';
import { postOrder } from '@/features/receive-order/api/index.js';
import { toast } from 'sonner';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

/**
 * @typedef {z.infer<typeof receiveOrderFormSchema>} OrderSchema
 */

/**
 * @type {OrderSchema}
 */
const defaultValues = {
  userId: undefined,
  sellerId: undefined,
  receiveDate: new Date(),
  products: [],
};

export const useOrderPostForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues,
    validators: {
      onChange: receiveOrderFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await postOrder(value);
        if (!response.success) return;
        queryClient.invalidateQueries({
          queryKey: ['receive-orders']
        })
        
        toast.success(response.message);
        form.reset();
        navigate('/dashboard/receive-order');
        return form;
      } catch (err) {
        if (err instanceof HTTPError) {
          const errResponse = await err.response.json().catch(() => null);

          return toast.error(
            typeof errResponse?.message === 'string'
              ? errResponse.message
              : ERROR.UNEXPECTED_ERROR,
          );
        }

        toast.error(ERROR.SERVER_ERROR);
      }
    },
  });

  return form;
};
