// @ts-check

import { vendorFormSchema } from '@/features/vendor/schema/vendor-schema.js';
import { useForm } from '@tanstack/react-form';

/**
 * @typedef {object} VendorItem
 * @property {number} itemId
 * @property {string} itemName
 * @property {number} unitPrice
 */

/** @type {import('zod').infer<typeof vendorFormSchema>} */
const defaultValues = {
  type: 'Supplier',
  vendorName: '',
  telephone: '',
  email: '',
  bossName: '',
  address: '',
  memo: '',
  items: [],
};

export const useVendorForm = () => {
  return useForm({
    defaultValues,
    validators: {
      onChange: vendorFormSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });
};
