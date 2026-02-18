// @ts-check

import { Button } from '@/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { fetchStatisticsBrands } from '@/features/statistics/api/index.js';
import { useIsMobile } from '@/hooks/use-mobile.js';
import { useQuery } from '@tanstack/react-query';
import { TagIcon } from 'lucide-react';
import { ChevronDownIcon } from 'lucide-react';
import { CheckIcon } from 'lucide-react';

/**
 * @typedef {object} BrandDropdownProps
 * @property {string} type
 * @property {string} brand
 * @property {React.Dispatch<React.SetStateAction<string>>} setBrand
 */

/**
 * @param {BrandDropdownProps} props 
 */
export const BrandDropdown = ({ type, brand, setBrand }) => {
  const isMobile = useIsMobile();

  const { data } = useQuery({
    queryKey: ['stats-brands', type],
    queryFn: () => fetchStatisticsBrands({ type }),
    enabled: Boolean(type),
    staleTime: 60_000,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={!type}
      >
        <Button
          size={isMobile ? 'icon-lg' : 'default'}
          variant='outline'
        >
          {isMobile ? (
            <TagIcon />
          ) : (
            <>
              {brand ? brand : (type ? '전체' : '주종 선택 필수')}
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
              setBrand('');
            }}
            className='flex items-center justify-between'
          >
            <span>전체</span>
            {!brand && <CheckIcon className='h-4 w-4 opacity-70' />}
          </DropdownMenuItem>

          {(data ?? []).map((b) => (
            <DropdownMenuItem
              key={b}
              onSelect={(e) => {
                e.preventDefault();
                setBrand(b);
              }}
            >
              <span className='truncate'>{b}</span>
              {brand === b && <CheckIcon className='h-4 w-4 opacity-70' />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
