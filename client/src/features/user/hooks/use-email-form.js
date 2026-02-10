// @ts-check

import { sendEmail } from '../api/index.js';
import { emailFormSchema } from '../schemas/email-form-schema.js';

/**
 * Hooks
 */
import { useForm } from '@tanstack/react-form';

const defaultValues = { email: '' };

export const useEmailForm = () => {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: emailFormSchema
    },
    onSubmit: async ({ value }) => {
      const response = await sendEmail(value);
      console.log(response);
    }
  });

  return form;
};
