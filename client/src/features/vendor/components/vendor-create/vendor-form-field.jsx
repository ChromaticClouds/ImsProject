import { Input } from '@/components/ui/input';

export function VendorFormField({
  label,
  required = false,
  value,
  onChange,
  onBlur,
  placeholder,
  inputMode,
  error,
  colSpan = 'col-span-12',
}) {
  return (
    <div className={colSpan}>
      <div className='mb-1 flex items-center justify-between'>
        <div className='text-sm font-semibold'>
          {label}{' '}
          {required ? <span className='text-destructive'>*</span> : null}
        </div>
        {error ? <div className='text-xs text-destructive'>{error}</div> : null}
      </div>

      <Input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        inputMode={inputMode}
        className={
          error ? 'border-destructive focus-visible:ring-destructive' : ''
        }
      />
    </div>
  );
}
