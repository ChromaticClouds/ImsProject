import { AppDatePicker } from '@/components/common/app-date-picker.jsx';
import { FieldError } from '@/components/ui/field.js';

/**
 * Hooks
 */
import { useOrderPostContext } from '../../providers/receive-order-post-provider.jsx';

export const ReceiveOrderDatePicker = () => {
  const { form } = useOrderPostContext();

  return (
    <div className='w-full grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
      <span className='text-sm md:text-base'>납기 희망일</span>
      <form.Field name='receiveDate'>
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <div className='flex flex-col items-baseline md:flex-row gap-3 w-full md:items-center min-w-0'>
              <AppDatePicker
                date={field.state.value}
                setDate={(e) => field.handleChange(e)}
                className='w-60'
              />

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </div>
          );
        }}
      </form.Field>
    </div>
  );
};
