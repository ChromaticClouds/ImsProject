// @ts-check
import { VendorPagination } from '@/features/vendor/components/vendor-pagination';
import { useVendorContext } from '@/features/vendor/providers/vendor-provider';

export const VendorPaginationContainer = () => {
  const { query, size } = useVendorContext();
  const pageInfo = query.data?.pageInfo;

  if (!pageInfo) return null;

  return (
    <VendorPagination
      pageInfo={pageInfo}
      basePath="/dashboard/vendor"
      extraQuery={{ size }}
    />
  );
};
