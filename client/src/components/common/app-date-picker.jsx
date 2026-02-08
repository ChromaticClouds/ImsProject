// @ts-check

import { format } from 'date-fns';

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import { Calendar } from '@/components/ui/calendar.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.js';

/**
 * Assets
 */
import { CalendarIcon } from 'lucide-react';

/**
 * @param {{ date: Date, setDate: (date: Date) => void }} props
 */
export const AppDatePicker = ({ date = new Date(), setDate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          data-empty={!date}
          className='data-[empty=true]:text-muted-foreground md:w-60 w-full justify-start text-left font-normal'
        >
          <CalendarIcon />
          {date ? format(date, 'PPP') : <span>날짜를 선택해주세요</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-max p-0'
        side='bottom'
        align='start'
      >
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
};
