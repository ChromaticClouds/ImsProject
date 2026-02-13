/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';

/**
 * Assets
 */
import {
  ChartBarIcon,
  BottleWineIcon,
  StoreIcon,
  CheckIcon,
} from 'lucide-react';

/**
 * Stores
 */
import { useLeadTimeFilterStore } from '../stores/use-lead-time-filter-store.js';

export const LeadTimeTypeAction = () => {
  const searchType = useLeadTimeFilterStore(
    (s) => s.filter.searchType
  );
  const setSearchType = useLeadTimeFilterStore(
    (s) => s.setSearchType
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon-lg' variant='outline'>
          <ChartBarIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-54'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='text-muted-foreground'>
            차트 선택
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setSearchType('vendor')}
          >
            <StoreIcon />
            <span>거래처 별 리드타임</span>

            {searchType === 'vendor' && (
              <CheckIcon className='ml-auto h-4 w-4' />
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setSearchType('product')}
          >
            <BottleWineIcon />
            <span>품목 별 리드타임</span>

            {searchType === 'product' && (
              <CheckIcon className='ml-auto h-4 w-4' />
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
