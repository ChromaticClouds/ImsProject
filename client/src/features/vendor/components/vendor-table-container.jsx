// @ts-check
import { VendorTable } from '@/features/vendor/components/vendor-table';
import { useVendorSearch } from '@/features/vendor/hooks/use-vendor-search';
import { useVendors } from '@/features/vendor/hooks/use-vendors';
import { useNavigate } from 'react-router-dom';

export const VendorTableContainer = () => {
  const navigate = useNavigate();
  const { search } = useVendorSearch();
  const query = useVendors(search);

  const vendors = query.data?.list ?? [];

  if (query.isError) {
    return (
      <div className='rounded-md border p-4'>
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return query.isFetching ? (
    <div className='text-sm text-muted-foreground'>불러오는 중...</div>
  ) : (
    <div className='relative'>
      <VendorTable
        vendors={vendors}
        onRowClick={(id) => navigate(`/dashboard/vendor/${id}`)}
      />
    </div>
  );
};
