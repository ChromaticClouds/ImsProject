// @ts-check

/**
 * Hooks
 */
import { useDebounce } from '@/hooks/use-debounce.js';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

export const useProductSearch = () => {
  const [params, setParams] = useSearchParams();

  const [input, setInput] = useState(params.get('search') ?? '');

  const keyword = useDebounce(input, 500);

  useEffect(() => {
    const currentKeyword = params.get('search') ?? '';

    if (keyword === currentKeyword) return;

    setParams((current) => {
      const next = new URLSearchParams(current);

      if (keyword) next.set('search', keyword);
      else next.delete('search');

      next.set('page', '1');

      return next;
    }, { replace: true });
  }, [keyword, params, setParams]);

  return { input, setInput };
};
