// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu.js';

/**
 * Assets
 */
import { FilterIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useCategoryFilter } from '../hooks/use-category-filter.js';
import { XIcon } from 'lucide-react';

const categoryTypeMap = {
  SOJU: '소주',
  WHISKEY: '위스키',
  LIQUOR: '양주',
  TRADITIONAL: '전통주',
  KAOLIANG_LIQUOR: '고량주',
};

/**
 * 카테고리 배열에 따른 체크박스 드롭다운 렌더링
 * key: URL 쿼리 키
 * categories: 렌더링 될 체크박스 카테고리 이름
 * @param {{ categories: string[], queryKey: 'type' | 'brand' }} props
 * @returns
 */
export const ProductCategoryCheckbox = ({ categories = [], queryKey }) => {
  const { selected, toggleType, clearType } = useCategoryFilter(queryKey);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='gap-2'
        >
          <FilterIcon className='w-4 h-4' /> 주종 필터링
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-48'
      >
        <DropdownMenuLabel>카테고리 선택</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={clearType}
        >
          <XIcon />
          전체 해제
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {categories.map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={selected.includes(type)}
            onCheckedChange={(checked) => toggleType(type, checked)}
          >
            {queryKey === 'type' ? categoryTypeMap[type] : type}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
