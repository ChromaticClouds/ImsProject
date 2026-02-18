// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';

/**
 * Assets
 */
import { BottleWineIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useIsMobile } from '@/hooks/use-mobile.js';
import { useQuery } from '@tanstack/react-query';

/**
 * Api
 */
import { fetchStatisticsTypes } from '@/features/statistics/api/index.js';
import { ChevronDownIcon } from 'lucide-react';
import { CheckIcon } from 'lucide-react';

const typeMap = {
  WHISKEY: '위스키',
  SOJU: '소주',
  TRADITIONAL: '전통주',
  LIQUOR: '양주',
  KAOLIANG_LIQUOR: '고량주',
};

/**
 * @typedef {object} TypeDropdownProps
 * @property {string} type
 * @property {React.Dispatch<React.SetStateAction<string>>} setType
 */

/**
 * @param {TypeDropdownProps} props
 */
export const TypeDropdown = ({ type, setType }) => {
  const isMobile = useIsMobile();

  const { data } = useQuery({
    queryKey: ['stats-types'],
    queryFn: fetchStatisticsTypes,
    staleTime: 60_000,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={isMobile ? 'icon-lg' : 'default'}
          variant='outline'
        >
          {isMobile ? (
            <BottleWineIcon />
          ) : (
            <>
              {typeMap[type] || '전체'}
              <ChevronDownIcon />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setType('');
            }}
            className='flex items-center justify-between'
          >
            <span>전체</span>
            {!type && <CheckIcon className='h-4 w-4 opacity-70' />}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {(data ?? []).map((t) => (
            <DropdownMenuItem
              key={t}
              onSelect={(e) => {
                e.preventDefault();
                setType(t);
              }}
            >
              <span className='truncate'>{typeMap[t]}</span>
              {type === t && (
                <CheckIcon className='h-4 w-4 opacity-70 justify-end' />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
