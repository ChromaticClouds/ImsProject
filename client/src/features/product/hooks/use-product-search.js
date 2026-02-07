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
    const next = new URLSearchParams(params);

    if (keyword) next.set('search', keyword);
    else next.delete('search');

    console.log('transferred')

    next.set('page', '1');

    setParams(next);
  }, [keyword]);

  return { input, setInput };
};
