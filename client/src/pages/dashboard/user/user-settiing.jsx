/**
 * Components
 */
import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';
import { UserList } from '@/features/admin/components/user-setting/user-list.jsx';
import { UserPagination } from '@/features/admin/components/user-setting/user-pagination.jsx';
import { UserListHeader } from '@/features/admin/components/user-setting/user-list-header.jsx';

export const UserSetting = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <AppHeader
        title='사용자 설정'
        description='사용자 설정 페이지입니다.'
      />
      <div className='w-full flex flex-col'>
        <Card>
          <UserListHeader />
          <UserList />
          <UserPagination
            prefix='/dashboard/user/setting'
          />
        </Card>
      </div>
    </div>
  );
};
