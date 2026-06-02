import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { useDebounce } from '@/hooks/use-debounce.js';
import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const NoticeListSearch = ({
  isFetching = false,
}: {
  isFetching?: boolean;
}) => {
  const [params, setParams] = useSearchParams();
  const searchParam = params.get('search') ?? '';
  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const nextSearch = debouncedSearch.trim();

    if (nextSearch === searchParam) return;

    setParams((prev) => {
      const nextParams = new URLSearchParams(prev);

      if (nextSearch) {
        nextParams.set('search', nextSearch);
      } else {
        nextParams.delete('search');
      }

      nextParams.set('page', '1');

      return nextParams;
    }, { replace: true });
  }, [debouncedSearch, searchParam, setParams]);

  return (
    <InputGroup className='min-w-0 flex-1 sm:max-w-sm'>
      <InputGroupAddon>
        <SearchIcon
          className='size-4'
          aria-hidden='true'
        />
      </InputGroupAddon>
      <InputGroupInput
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder='제목, 작성자 검색...'
      />
      {isFetching && (
        <InputGroupAddon align='inline-end'>
          <Spinner
            className='size-4'
            aria-label='공지사항 검색 중'
          />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};
