import { format } from 'date-fns';

/**
 * Components
 */
import { Calendar } from '@/components/ui/calendar.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.jsx';
import { Button } from '@/components/ui/button.jsx';

/**
 * Assets
 */
import { CalendarIcon } from 'lucide-react';

/**
 * @typedef {Object} Props
 * @property {import('react-day-picker').DateRange} value
 * @property {(date: import('react-day-picker').DateRange) => void} onChange
 */

/**
 * @param {Props} props
 */
export const AppDateRangePicker = ({ value, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-63'
        >
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, 'yyyy-MM-dd')} ~{' '}
                {format(value.to, 'yyyy-MM-dd')}
              </>
            ) : (
              format(value.from, 'yyyy-MM-dd')
            )
          ) : (
            'Choose date'
          )}
          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='w-max overflow-hidden p-0'
        align='start'
        side='top'
      >
        <Calendar
          mode='range'
          selected={value}
          onSelect={onChange}
          captionLayout='dropdown'
        />
      </PopoverContent>
    </Popover>
  );
};
