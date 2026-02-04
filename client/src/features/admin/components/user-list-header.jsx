import * as React from 'react';

/**
 * Components
 */
import { Badge } from '@/components/ui/badge.js';
import {
  CardContent,
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
import { EmailDialog } from '@/features/admin/components/email-dialog.jsx';
import { useUserList } from '@/features/admin/components/user-provider.jsx';
import { useDebounce } from '@/hooks/use-debounce.js';

export const UserListHeader = () => {
  const { count, setSearch } = useUserList();
  const [input, setInput] = React.useState('');
  const debounced = useDebounce(input, 500);

  React.useEffect(() => {
    setSearch(debounced);
  }, [debounced, setSearch]);

  return (
    <React.Fragment>
      <CardHeader className='border-b'>
        <CardTitle className='flex w-full gap-3 items-center'>
          <span>사용자 목록</span>
          <Badge>{count} 명</Badge>
        </CardTitle>
        <CardDescription>모든 사원 및 관리자들을 확인하세요</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <div className='w-full flex justify-end'>
          <div className='flex gap-3'>
            <InputGroup className='max-w-xs'>
              <InputGroupInput
                placeholder='사용자 검색...'
                onChange={(e) => setInput(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
            <EmailDialog />
          </div>
        </div>
      </CardContent>
    </React.Fragment>
  );
};
