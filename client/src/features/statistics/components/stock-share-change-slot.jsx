// @ts-check

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
import { BottleWineIcon } from 'lucide-react';
import { WarehouseIcon } from 'lucide-react';
import { SortDescIcon } from 'lucide-react';

/**
 * 창고 점유율과 각 품목당 점유율 컴포넌트를 스위치하기 위한 헤더 버튼
 * @param {{ onChange: (value: 'WAREHOUSE' | 'PRODUCT') => void }} props
 */
export const StockShareChangeSlot = ({ onChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon-lg'
          variant='outline'
        >
          <SortDescIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side='bottom'
        align='end'
        className='w-56'
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className='text-muted-foreground'>
            차트 선택
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onChange('WAREHOUSE')}>
            <WarehouseIcon />
            <span>창고 점유율</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange('PRODUCT')}>
            <BottleWineIcon />
            <span>각 품목별 점유율</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
