import { UserGroupContainer } from '@/features/admin/components/user-group/user-group-container.jsx';
import { UserGroupHeader } from '@/features/admin/components/user-group/user-group-header.jsx';
import { UserGroupList } from '@/features/admin/components/user-group/user-group-list.jsx';
import { UserPagination } from '@/features/admin/components/user-setting/user-pagination.jsx';
import { UserProvider } from '@/features/admin/providers/user-provider.jsx';

export const UserGroup = () => {
  return (
    <UserProvider>
      <UserGroupContainer>
        <UserGroupHeader />
        <UserGroupList />
        <UserPagination prefix='/dashboard/user/group' />
      </UserGroupContainer>
    </UserProvider>
  );
};
