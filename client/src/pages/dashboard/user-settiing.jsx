/**
 * Components
 */
import { AppHeader } from '@/components/common/app-header.jsx';
import { EmailDialog } from '@/features/admin/components/email-dialog.jsx';
import { UserProvider } from '@/features/admin/components/user-provider.jsx';
import { UserList } from '@/features/admin/components/user-list.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';
import { SearchIcon } from 'lucide-react';
import { UserPagination } from '@/features/admin/components/user-pagination.jsx';

export const UserSetting = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center my-6'>
      <AppHeader
        title='사용자 설정'
        description='사용자 설정 페이지입니다.'
      />
      <div className='w-full flex flex-col'>
        <Card>
          <CardHeader className='border-b'>
            <CardTitle>사용자 목록</CardTitle>
            <CardDescription>
              모든 사원 및 관리자들을 확인하세요
            </CardDescription>
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
          <UserProvider>
            <UserList />
            <UserPagination />
          </UserProvider>
        </Card>
      </div>
    </div>
  );
};
