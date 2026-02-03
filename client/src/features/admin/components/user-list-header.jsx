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

export const UserListHeader = () => {
  return (
    <React.Fragment>
      <CardHeader className='border-b'>
        <CardTitle>
          <span>사용자 목록</span>
          <Badge>
            240명  
          </Badge>  
        </CardTitle>
        <CardDescription>모든 사원 및 관리자들을 확인하세요</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <div className='w-full flex justify-end'>
          <div className='flex gap-3'>
            <InputGroup className='max-w-xs'>
              <InputGroupInput placeholder='사용자 검색...' />
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
