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
import { ChevronDownIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useState } from 'react';

/**
 * Utils
 */
import { format } from 'date-fns';

export const AppDatePicker = () => {
  const [date, setDate] = useState();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          data-empty={!date}
          className='data-[empty=true]:text-muted-foreground w-53 justify-between text-left font-normal'
        >
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-auto p-0'
        align='start'
      >
        <Calendar
          mode='single'
          
        />
      </PopoverContent>
    </Popover>
  );
};
