// @ts-check

import { useForm } from "@tanstack/react-form";

export const useAdjustForm = () => {
  return useForm({
    defaultValues: {
      products: [],
      date: { from: null, to: null },
      type: 'PLUS',
      memo: '',
    },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });
};

