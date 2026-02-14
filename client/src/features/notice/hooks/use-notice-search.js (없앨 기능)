// @ts-check
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/use-debounce';

/**
 * 공지사항 검색 훅
 */
export const useNoticeSearch = () => {
  const [params, setParams] = useSearchParams();

  const [input, setInput] = useState(() => params.get('search') ?? '');

  const debounced = useDebounce(input, 500);

  useEffect(() => {
    const next = new URLSearchParams(params);
    const keyword = debounced.trim();

    if (!keyword) {
      next.delete('search');
    } else {
      next.set('search', keyword);
      next.set('page', '1');
    }

    if (next.toString() === params.toString()) return;

    setParams(next);
  }, [debounced, params, setParams]);

  return { input, setInput };
};
