// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';

/**
 * Assets
 */
import { CalendarIcon } from 'lucide-react';

/**
 * Stores
 */
import { useLeadTimeFilterStore } from '../stores/use-lead-time-filter-store.js';
import { useState } from 'react';
import { CheckIcon } from 'lucide-react';

export const LeadTimeCalendarAction = () => {
  const [checked, setChecked] = useState(30);

  const setLastDays = useLeadTimeFilterStore((s) => s.setLastDays);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon-lg'
          variant='outline'
        >
          <CalendarIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-24'
        align='end'
      >
        <DropdownMenuLabel className='text-muted-foreground'>
          기간 설정
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setLastDays(30);
            setChecked(30);
          }}
        >
          30일
          {checked === 30 && <CheckIcon className='ml-auto h-4 w-4' />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setLastDays(60);
            setChecked(60);
          }}
        >
          60일
          {checked === 60 && <CheckIcon className='ml-auto h-4 w-4' />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setLastDays(180);
            setChecked(180);
          }}
        >
          180일
          {checked === 180 && <CheckIcon className='ml-auto h-4 w-4' />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
