// @ts-check
import { useForm } from "@tanstack/react-form";
import { receiveOrderFormSchema } from "../schemas/receive-order-form-schema.js";
import z from 'zod';

/**
 * @typedef {z.infer<typeof receiveOrderFormSchema>} OrderSchema
 */

/**
 * @type {OrderSchema}
 */
const defaultValues = {
  userId: undefined,
  sellerId: undefined,
  receiveDate: undefined,
  products: []
}

export const useOrderPostForm = () => {
  return useForm({
    defaultValues,
    validators: {
      onChange: receiveOrderFormSchema
    },
    onSubmit: ({ value }) => {
      console.log(value);
    }
  });
};
