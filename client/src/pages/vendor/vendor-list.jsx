// @ts-check
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import { VendorProvider } from '@/features/vendor/providers/vendor-provider';
import { VendorTableContainer } from '../../features/vendor/components/vendor-table-container.jsx';
import { VendorPaginationContainer } from '../../features/vendor/components/vendor-pagination-container.jsx';
import { VendorSearch } from '@/features/vendor/components/vendor-search';
import { AppHeader } from '@/components/common/app-header.jsx';

export const VendorList = () => {
  const navigate = useNavigate();

  return (
    <VendorProvider>
      <div className='p-4 space-y-4'>
      <AppHeader
                    title='거래처'
                    description='거래처를 확인하세요'
                  />
        <VendorSearch />
        <VendorTableContainer />
        <VendorPaginationContainer />
        <Button onClick={() => navigate('/dashboard/vendor/create')}>
            거래처 등록
          </Button>
      </div>
    </VendorProvider>
  );
};
