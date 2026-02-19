// @ts-check

/**
 * Components
 */
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';

/**
 * Assets
 */
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * Hooks
 */
import { useSearchParams } from 'react-router-dom';
import { useGetUserGroup } from '../../hooks/use-get-user-group.js';
import { useDebounce } from '@/hooks/use-debounce.js';
import { useEffect } from 'react';

export const UserGroupHeader = () => {
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
    });
  }, [debounced, searchParam, setParams]);

  return (
    <CardHeader className='border-b gap-0'>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-2 justify-center'>
          <CardTitle>조직도 목록</CardTitle>
          <CardDescription>사내 모든 임원들을 확인하세요</CardDescription>
        </div>
        <InputGroup className='w-80'>
          <InputGroupInput
            placeholder='사용자명 검색'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </CardHeader>
  );
};
