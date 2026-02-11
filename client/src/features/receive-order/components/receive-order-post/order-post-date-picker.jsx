import { AppDatePicker } from '@/components/common/app-date-picker.jsx';

/**
 * Hooks
 */
import { useOrderPostContext } from '../../providers/receive-order-post-provider.jsx';

export const ReceiveOrderDatePicker = () => {
  const { form } = useOrderPostContext();

  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <div className='grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
        <span className='text-sm md:text-base'>납기 희망일</span>
        <form.Field name='receiveDate'>
          {(field) => (
            <AppDatePicker
              date={field.state.value}
              setDate={(e) => field.handleChange(e)}
            />
          )}
        </form.Field>
      </div>
    </div>
  );
};
