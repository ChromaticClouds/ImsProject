import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.js';
import { Calendar } from '@/components/ui/calendar.js';
import { format } from 'date-fns';

export const AppDatePicker = ({ date = new Date(), setDate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          data-empty={!date}
          className='data-[empty=true]:text-muted-foreground w-60 justify-start text-left font-normal'
        >
          <CalendarIcon />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
};