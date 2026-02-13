// @ts-check

import { Field, FieldLabel } from '@/components/ui/field.js';

/**
 * @typedef {object} FieldProps
 * @property {string} name
 * @property {string} label
 */

/**
 * @param {FieldProps & React.PropsWithChildren} props
 */
export const FieldContainer = ({ name, label, children }) => {
  return (
    <div>
      <Field>
        <div className='grid grid-cols-[100px_1fr]'>
          <FieldLabel
            className='text-md'
            htmlFor={name}
          >
            {label}
          </FieldLabel>
          <div className='w-60'>{children}</div>
        </div>
      </Field>
    </div>
  );
};
