import { useForm } from '@tanstack/react-form';
import { adjustFormSchema } from '../schemas/adjust-form-schema.js';
import { adjustProducts } from '../api/index.js';
import { HTTPError } from 'ky';
import { toast } from 'sonner';
import { ERROR } from '@/services/error.js';

/**
 * @typedef {object} DefaultValueState
 * @property {AdjustItem[]} products
 * @property {Date} date
 * @property {string} memo
 */

/** @type {DefaultValueState} */
const defaultValues = {
  products: [],
  date: new Date(),
  memo: '',
};

export const useAdjustForm = () => {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: adjustFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await adjustProducts(value);
        if (response.success) toast.success(response.message);
        form.reset();
        return form
      } catch (err) {
        if (err instanceof HTTPError) {
          return toast.error(await err.response.json()?.message);
        }

        toast.error(ERROR.SERVER_ERROR);
      }
    },
  });

  return form;
};
