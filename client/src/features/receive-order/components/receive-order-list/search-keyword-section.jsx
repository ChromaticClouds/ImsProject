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
import { useDebounce } from '@/hooks/use-debounce.js';
import { useReceiveOrderFilterStore } from '../../stores/use-receive-order-filter-store.js';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const SearchKeywordSection = () => {
  const [, setParams] = useSearchParams();
  const search = useReceiveOrderFilterStore((state) => state.search);
  const setKeyword = useReceiveOrderFilterStore((state) => state.setKeyword);
  const [input, setInput] = useState(search ?? '');

  const debounced = useDebounce(input, 500);
  const normalized = debounced?.trim() || null;

  useEffect(() => {
    if (normalized === search) return;

    setKeyword(normalized);

    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', '1');
      return next;
    });
  }, [normalized, search, setKeyword, setParams]);

  return (
    <InputGroup className='w-full md:min-w-[320px] xl:w-100'>
      <InputGroupInput
        placeholder='수주번호 / 판매처 / 대표자 / 담당자 검색'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon className='h-4 w-4' />
      </InputGroupAddon>
    </InputGroup>
  );
};
