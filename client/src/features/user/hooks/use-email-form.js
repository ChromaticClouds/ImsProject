// @ts-check

import { toast } from 'sonner';
import { sendEmail } from '../api/index.js';
import { emailFormSchema } from '../schemas/email-form-schema.js';

/**
 * Hooks
 */
import { useForm } from '@tanstack/react-form';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';

const defaultValues = { email: '' };

export const useEmailForm = () => {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: emailFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await sendEmail(value);
        if (!response.success) return;
        toast.success(response.message);
        form.reset();
      } catch (err) {
        if (err instanceof HTTPError) {
          const errResponse = await err.response.json().catch(() => null);
          return toast.success(
            typeof errResponse?.message === 'string'
              ? errResponse?.message
              : ERROR.UNEXPECTED_ERROR,
          );
        }

        toast.error(ERROR.SERVER_ERROR);
      }
    },
  });

  return form;
};
