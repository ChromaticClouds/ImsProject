// @ts-check
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/common/app-header.jsx';
import { VendorSearch } from '@/features/vendor/components/vendor-list/vendor-search';
import { VendorTableContainer } from '@/features/vendor/components/vendor-list/vendor-table-container.jsx';
import { VendorPaginationContainer } from '@/features/vendor/components/vendor-list/vendor-pagination-container.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';
import { isDemoUser } from '@/features/auth/utils/is-demo-user.js';

export const VendorList = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isDemo = isDemoUser(user);

  return (
    <div className='p-4 space-y-4'>
      <AppHeader
        title='거래처'
        description='거래처를 확인하세요.'
      />
      <VendorSearch />
      <VendorTableContainer />
      <VendorPaginationContainer />
      {!isDemo ? (
        <Button onClick={() => navigate('/dashboard/vendor/create')}>
          거래처 등록
        </Button>
      ) : null}
    </div>
  );
};
