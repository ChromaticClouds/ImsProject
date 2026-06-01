import { Label } from '@/components/ui/label.js';

/**
 * @param {{ htmlFor: string; label: string; required?: boolean }} props
 */
export const FieldLabel = ({ htmlFor, label, required = false }) => {
  return (
    <Label
      htmlFor={htmlFor}
      className='text-sm font-medium'
    >
      {label}
      {required && (
        <span
          className='ml-0.5 text-orange-500'
          aria-hidden='true'
        >
          *
        </span>
      )}
    </Label>
  );
};
