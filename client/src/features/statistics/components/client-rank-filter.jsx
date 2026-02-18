// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { StatisticsDateRangePicker } from '@/features/statistics/components/statistics-date-range-picker.jsx';

/**
 * Hooks
 */
import { useClientRankStore } from '@/features/statistics/stores/use-client-rank-store.js';
import { CheckIcon } from 'lucide-react';
import { StoreIcon } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

export const ClientRankFilter = () => {
  const [range, setRange, mode, setMode] = useClientRankStore(
    useShallow((s) => [s.range, s.setRange, s.mode, s.setMode]),
  );

  return (
    <div className='h-full flex items-center gap-3 flex-wrap'>
      <StatisticsDateRangePicker
        variant='icon'
        value={range}
        onChange={setRange}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon-lg'
            variant='outline'
          >
            <StoreIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMode('inbound');
            }}
            className='flex items-center justify-between'
          >
            <span className='truncate'>공급처</span>
            {mode === 'inbound' && <CheckIcon className='h-4 w-4 opacity-70' />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMode('outbound');
            }}
            className='flex items-center justify-between'
          >
            <span className='truncate'>판매처</span>
            {mode === 'outbound' && (
              <CheckIcon className='h-4 w-4 opacity-70' />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
