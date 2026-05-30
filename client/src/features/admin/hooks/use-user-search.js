import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/use-debounce.js';

export const useUserSearch = () => {
  const [params, setParams] = useSearchParams();
  const searchParam = params.get('search') ?? '';
  const [search, setSearch] = useState(searchParam);
  const debounced = useDebounce(search, 500);

  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const next = debounced.trim();

    if (next === searchParam) return;

    setParams((prev) => {
      const p = new URLSearchParams(prev);

      if (next) p.set('search', next);
      else p.delete('search');

      p.set('page', '1');
      return p;
    }, { replace: true });
  }, [debounced, searchParam, setParams]);

  return { search, setSearch };
};
