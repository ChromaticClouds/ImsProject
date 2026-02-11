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

export const LeadTimeCalendarAction = () => {
  const setLastDays = useLeadTimeFilterStore((s) => s.setLastDays);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon-lg' variant='outline'>
          <CalendarIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-24' align='end'>
        <DropdownMenuLabel className='text-muted-foreground'>
          기간 설정
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => setLastDays(30)}>
          30일
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setLastDays(60)}>
          60일
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setLastDays(180)}>
          180일
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
