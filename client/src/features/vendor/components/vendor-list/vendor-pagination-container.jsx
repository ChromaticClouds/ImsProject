// @ts-check
import { VendorPagination } from '@/features/vendor/components/vendor-list/vendor-pagination';
import { useVendorSearch } from '@/features/vendor/hooks/use-vendor-search';
import { useVendors } from '@/features/vendor/hooks/use-vendors';

export const VendorPaginationContainer = () => {
  const { search } = useVendorSearch();
  const query = useVendors(search);
  const pageInfo = query.data?.pageInfo;
  const size = pageInfo?.size ?? 10;

  if (!pageInfo) return null;

  return (
    <VendorPagination
      pageInfo={pageInfo}
      basePath='/dashboard/vendor'
      extraQuery={{ size }}
    />
  );
};
