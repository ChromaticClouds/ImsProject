// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';

/**
 * Assets
 */
import { FilterIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useMemo } from 'react';
import { useCategoryFilter } from '@/features/product/hooks/use-category-filter.js';
import { useProductContext } from '@/features/product/providers/product-provider.jsx';

export const ProductTypeCheckBox = () => {
  const { content } = useProductContext();

  const productType = useMemo(
    () => [...new Set(content.map((c) => c.type))],
    [content],
  );

  const { selected, toggleType } = useCategoryFilter('type');

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
        {productType.map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={selected.includes(type)}
            onCheckedChange={(checked) => toggleType(type, checked)}
          >
            {type}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
