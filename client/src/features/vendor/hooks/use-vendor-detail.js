// @ts-check

import { vendorDetail } from '@/features/vendor/api/index.js';
import { useQuery } from '@tanstack/react-query';

/**
 * 거래처 상세 조회
 * @param {string} id 
 */
export function useVendorDetail(id) {
  const vendorId = Number(id);

  return useQuery({
    queryKey: ['vendor-detail', vendorId],
    queryFn: () => vendorDetail(vendorId),
    enabled: !!vendorId,
  });
}


