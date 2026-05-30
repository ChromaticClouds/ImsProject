/**
 * Components
 */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/components/ui/field';

/**
 * Hooks
 */
import { useFieldContext } from '@/components/form';

/**
 * Types
 */
import type { JSX } from 'react';

type TextFieldProps = {
  label: JSX.Element;
  className?: string;
};

export const TextField = ({ label, className = 'h-10' }: TextFieldProps) => {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div className='flex flex-col gap-2 space-y-1'>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className={className}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </div>
  );
};
