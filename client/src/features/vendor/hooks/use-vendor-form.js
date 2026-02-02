// @ts-check

import { vendorFormSchema } from "@/features/vendor/schema/vendor-schema.js";
import { useForm } from "@tanstack/react-form"

/**
 * @typedef {object} VendorDefaultValues
 * @property {'Supplier' | 'Seller'} type
 * @property {string} vendorName
 * @property {string} telephone
 * @property {string} email
 * @property {string} bossName
 * @property {string} address
 * @property {string} memo
 */

/** @type {VendorDefaultValues} */
const defaultValues = {
  type: 'Supplier',
  vendorName: '',
  telephone: '',
  email: '',
  bossName: '',
  address: '',
  memo: '',
};

export const useVendorForm = () => {
  return useForm({
    defaultValues,
    validators: {
      onChange: vendorFormSchema
    },
    onSubmit: ({ value }) => {
      console.log(value);
    }
  });
}