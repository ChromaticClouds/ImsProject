// @ts-check
import { useMemo } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.js';
import { Calendar } from '@/components/ui/calendar.js';
import { format, parseISO, isValid, differenceInCalendarDays } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile.js';

/** @typedef {{ from: string, to: string }} DateRangeValue */

function toDate(s) {
  if (!s) return undefined;
  const d = parseISO(s);
  return isValid(d) ? d : undefined;
}

function toYMD(d) {
  return d ? format(d, 'yyyy-MM-dd') : '';
}

/**
 * @typedef {{ from: string, to: string }} DateRange
 */

/**
 * @typedef {object} StatsDatePickerProps
 * @property {'default' | 'icon'} [variant]
 * @property {DateRange} value
 * @property {(value: DateRange) => void} onChange
 * @property {boolean} [disabled]
 */

/** @param {StatsDatePickerProps} props */
export function StatisticsDateRangePicker({
  variant = 'default',
  value,
  onChange,
  disabled,
}) {
  const isMobile = useIsMobile();

  const from = toDate(value?.from);
  const to = toDate(value?.to);

  const selected =
    from && to ? { from, to } : from ? { from, to: undefined } : undefined;
  const label =
    value?.from && value?.to ? `${value.from} ~ ${value.to}` : '기간 설정';

  const today = new Date();

  function handleSelect(next) {
    if (!next?.from || !next?.to) {
      onChange({
        from: next?.from ? toYMD(next.from) : value.from,
        to: next?.to ? toYMD(next.to) : '',
      });
      return;
    }

    // 미래 선택 불가
    if (next.to > today) {
      alert('미래 날짜는 선택할 수 없습니다.');
      return;
    }

    // 기간 제한
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
        <Button
          type='button'
          variant='outline'
          disabled={!!disabled}
          size={variant === 'icon' || isMobile ? 'icon-lg' : 'default'}
        >
          <CalendarIcon />
          {(variant === 'icon' || !isMobile && label)}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='p-0 w-auto'>
        <Calendar
          mode='range'
          numberOfMonths={1}
          selected={selected}
          onSelect={handleSelect}
          disabled={(d) => d > today}
        />
      </PopoverContent>
    </Popover>
  );
}