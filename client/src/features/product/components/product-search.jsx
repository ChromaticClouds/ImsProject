// @ts-check

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
 * Hooks
 */
import { useProductSearch } from '../hooks/use-product-search.js';

export const ProductSearch = () => {
  const { input, setInput } = useProductSearch();

  return (
    <div className='w-full flex justify-end'>
      <InputGroup className='w-80'>
        <InputGroupInput
          placeholder='품목명 / 코드 / 브랜드 검색'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='pl-8'
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
