// @ts-check

/**
 * Component
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
import { useProductContext } from '@/features/product/providers/product-provider.jsx';
import { useMemo } from 'react';
import { useCategoryFilter } from '@/features/product/hooks/use-category-filter.js';

export const ProductBrandCheckbox = () => {
  const { content } = useProductContext();

  const productBrand = useMemo(
    () => [...new Set(content.map((c) => c.brand))],
    [content],
  );

  const { selected, toggleType } = useCategoryFilter('brand');

  const allChecked =
    productBrand.length > 0 && productBrand.every((b) => selected.includes(b));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='gap-2'
        >
          <FilterIcon className='brand' /> 브랜드 필터링
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-48'
      >
        {/* 드롭다운시 전체 선택, 해제 버튼 */}
        <DropdownMenuLabel>브랜드 선택</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {productBrand.map((brand) => (
          <DropdownMenuCheckboxItem
            key={brand}
            checked={selected.includes(brand)}
            onCheckedChange={(checked) => toggleType(brand, checked)}
          >
            {brand}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
