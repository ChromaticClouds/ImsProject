/**
 * Components
 */
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';

/**
 * Assets
 */
import { SearchIcon } from 'lucide-react';

/**
 * Stores
 */
import { useProductSearchStore } from '@/features/product/stores/use-product-search-store.js';
import { useProductSearch } from '@/features/product/hooks/use-product-search.js';
import { Card } from '@/components/ui/card.js';

export const AdjustProductSearch = () => {
  const { data } = useProductSearch();

  const { isOpen, setIsOpen, keyword, setKeyword } = useProductSearchStore();

  return (
    <div className='relative w-120'>
      <InputGroup className='h-12'>
        <InputGroupInput
          placeholder='제품 검색...'
          size={48}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      {isOpen && (
        <Card className='absolute top-full mt-2 left-0 w-full max-h-80 h-80 shadow z-50 overflow-hidden overflow-y-auto py-2 gap-2'>
          {data?.data.map((v) => (
            <div
              key={v.id}
              className='min-h-16 h-16'
            >
              {v.name} - {v.perCount}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};
