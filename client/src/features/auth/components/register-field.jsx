// @ts-check
import { Field, FieldError } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';

import { useAuthForm } from '@/features/auth/hooks/use-auth-form.js';

/**
 * @typedef {object} FormData
 * @property {ReturnType<typeof useAuthForm>['register']} form
 * @property {keyof RegisterFormSchema} name
 * @property {string} label
 */

/**
 * @param {FormData & React.PropsWithChildren & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'form'>} props
 */
export const RegisterField = ({ form, name, label, children, ...inputProps }) => {
  return (
    <form.Field name={name}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field>
            {children ?? <Label htmlFor={field.name}>{label}</Label>}

            <Input
              {...inputProps}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />

            {isInvalid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        );
      }}
    </form.Field>
  );
};
