// @ts-check
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.js';
import { Calendar } from '@/components/ui/calendar.js';
import { format, parseISO, isValid, differenceInCalendarDays } from 'date-fns';

/**
 * 화면에서 쓰는 값(문자열)
 * @typedef {{ from: string, to: string }} DateRangeValue
 */

/** @param {string} s */
function toDate(s) {
  if (!s) return undefined;
  const d = parseISO(s); // 'yyyy-MM-dd' OK
  return isValid(d) ? d : undefined;
}

/** @param {Date | undefined} d */
function toYMD(d) {
  return d ? format(d, 'yyyy-MM-dd') : '';
}

/**
 * @param {{
 *  value: DateRangeValue,
 *  onChange: (next: DateRangeValue) => void,
 *  disabled?: boolean,
 * }} props
 */
export function InboundDateRangePicker({ value, onChange, disabled }) {
  const from = toDate(value?.from);
  const to = toDate(value?.to);

  /** @type {import('react-day-picker').DateRange | undefined} */
  const selected = from && to ? { from, to } : from ? { from, to: undefined } : undefined;

  const label =
    value?.from && value?.to ? `${value.from} ~ ${value.to}` : '기간 선택';

  /** @param {import('react-day-picker').DateRange | undefined} next */
  function handleSelect(next) {
    
    if (!next?.from || !next?.to) {
      
      onChange({
        from: next?.from ? toYMD(next.from) : value.from,
        to: next?.to ? toYMD(next.to) : '',
      });
      return;
    }

    const diff = Math.abs(differenceInCalendarDays(next.to, next.from));
    if (diff > 365) {
      alert('기간은 최대 1년까지만 선택할 수 있습니다.');
      return;
    }

    onChange({ from: toYMD(next.from), to: toYMD(next.to) });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" disabled={!!disabled} className="w-72 justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          numberOfMonths={1}    
          selected={selected}     
          onSelect={handleSelect} 
        />
      </PopoverContent>
    </Popover>
  );
}
