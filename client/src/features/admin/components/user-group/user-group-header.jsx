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

/**
 * Hooks
 */
import { useUserList } from '@/features/admin/providers/user-provider.jsx';

export const UserGroupHeader = () => {
  const { search, setSearch } = useUserList();

  return (
    <CardHeader className='border-b gap-0'>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-2 justify-center'>
          <CardTitle>조직도 목록</CardTitle>
          <CardDescription>사내 모든 임원들을 확인하세요</CardDescription>
        </div>
        <InputGroup className='w-100'>
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
