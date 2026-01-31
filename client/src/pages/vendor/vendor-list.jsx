// @ts-check
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import { VendorProvider } from '@/features/vendor/providers/vendor-provider';
import { VendorTableContainer } from '../../features/vendor/components/vendor-table-container.jsx';
import { VendorPaginationContainer } from '../../features/vendor/components/vendor-pagination-container.jsx';

export const VendorList = () => {
  const navigate = useNavigate();

  return (
    <VendorProvider>
      <div className='p-4 space-y-4'>
        <header className='flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>거래처 목록</h1>
          <Button onClick={() => navigate('/dashboard/vendor/create')}>
            거래처 등록
          </Button>
        </header>

        <VendorTableContainer />
        <VendorPaginationContainer />
      </div>
    </VendorProvider>
  );
};
