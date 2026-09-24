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
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const SearchKeywordSection = () => {
  const [, setParams] = useSearchParams();
  const [input, setInput] = useState('');
  const isInitialRender = useRef(true);

  const setKeyword = useReceiveOrderFilterStore((state) => state.setKeyword);

  const debounced = useDebounce(input, 500);

  useEffect(() => {
    setKeyword(debounced?.trim() || null);

    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', '1');
      return next;
    });
  }, [debounced, setKeyword, setParams]);

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
