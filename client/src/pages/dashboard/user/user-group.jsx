import { UserGroupContainer } from '@/features/admin/components/user-group/user-group-container.jsx';
import { UserGroupHeader } from '@/features/admin/components/user-group/user-group-header.jsx';
import { UserGroupList } from '@/features/admin/components/user-group/user-group-list.jsx';
import { UserGroupPagination } from '@/features/admin/components/user-group/user-group-pagination.jsx';
import { UserProvider } from '@/features/admin/providers/user-provider.jsx';

export const UserGroup = () => {
  return (
    <UserProvider>
      <UserGroupContainer>
        <UserGroupHeader />
        <UserGroupList />
        <UserGroupPagination />
      </UserGroupContainer>
    </UserProvider>
  );
};
