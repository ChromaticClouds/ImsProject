/**
 * Hooks
 */
import { useForm } from '@tanstack/react-form';

/**
 * Schema
 */
import { adjustFormSchema } from '../schemas/adjust-form-schema.js';

/**
 * Utils
 */
import { toast } from 'sonner';

/**
 * Api
 */
import { adjustProducts } from '../api/index.js';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';
import { useQueryClient } from '@tanstack/react-query';
import { formatToIsoDate } from '@/features/receive-order/utils/format-date.js';

/**
 * @typedef {object} DefaultValueState
 * @property {AdjustItem[]} products
 * @property {'PLUS' | 'MINUS'} type
 * @property {Date} date
 * @property {string} memo
 */

/** @type {DefaultValueState} */
const defaultValues = {
  products: [],
  type: 'PLUS',
  memo: '',
};

export const useAdjustForm = () => {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues,
    validators: {
      onChange: adjustFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formattedForm = { ...value, date: formatToIsoDate(value.date) };

        const response = await adjustProducts(formattedForm);
        if (response.success) toast.success(response.message);

        queryClient.invalidateQueries({
          queryKey: ['adjust-products'],
        });

        form.reset();
        return form;
      } catch (err) {
        if (err instanceof HTTPError) {
          return toast.error(
            (await err.response.json()?.message) || ERROR.SERVER_ERROR,
          );
        }

        toast.error(ERROR.SERVER_ERROR);
      }
    },
  });

  return form;
};
