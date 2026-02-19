// @ts-check

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
import { cn } from '@/lib/utils.js';

/**
 * @param {{ date?: Date, setDate?: (date: Date) => void, disabled?: boolean, className?: string, min?: Date }} props
 */
export const AppDatePicker = ({
  date = new Date(),
  setDate = () => {},
  disabled = false,
  min,
  className
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          data-empty={!date}
          disabled={disabled}
          className={cn(`${className} data-[empty=true]:text-muted-foreground justify-start text-left font-normal`)}
        >
          <CalendarIcon />
          {date ? format(date, 'PPP', { locale: ko }) : <span>날짜를 선택해주세요</span>}
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
          disabled={{ before: min }}
        />
      </PopoverContent>
    </Popover>
  );
};
