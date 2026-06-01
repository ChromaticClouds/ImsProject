import { AlertCircleIcon } from 'lucide-react';

/**
 * @param {{ id: string; message?: string }} props
 */
export const FieldErrorMessage = ({ id, message }) => {
  if (!message) return null;

  return (
    <p
      id={id}
      role='alert'
      className='flex items-center gap-1.5 text-xs text-destructive'
    >
      <AlertCircleIcon
        className='size-3.5'
        aria-hidden='true'
      />
      {message}
    </p>
  );
};

/**
 * @param {{ id: string; message?: string }} props
 */
export const InlineFieldErrorMessage = ({ id, message }) => {
  if (!message) return null;

  return (
    <span
      id={id}
      role='alert'
      className='text-xs font-normal text-destructive'
    >
      {message}
    </span>
  );
};
