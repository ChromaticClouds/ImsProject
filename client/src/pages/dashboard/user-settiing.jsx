/**
 * Components
 */
import { AppHeader } from '@/components/common/app-header.jsx';
<<<<<<< HEAD
import { EmailDialog } from '@/features/admin/components/email-dialog.jsx';

export const UserSetting = () => {
  return (
    <div className='flex flex-col w-full h-full'>
      <AppHeader
        title='사용자 설정'
        description='사용자들을 관리하고 권한을 설정할 수 있습니다.'
      />
      <EmailDialog />
=======
import { Card } from '@/components/ui/card.js';
import { UserList } from '@/features/admin/components/user-list.jsx';
import { UserPagination } from '@/features/admin/components/user-pagination.jsx';
import { UserListHeader } from '@/features/admin/components/user-list-header.jsx';
import { UserProvider } from '@/features/admin/providers/user-provider.jsx';

export const UserSetting = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <AppHeader
        title='사용자 설정'
        description='사용자 설정 페이지입니다.'
      />
      <div className='w-full flex flex-col'>
        <Card>
          <UserProvider>
            <UserListHeader />
            <UserList />
            <UserPagination />
          </UserProvider>
        </Card>
      </div>
>>>>>>> 13fb487cec0e7da63e70829cdd77f506da740620
    </div>
  );
};
