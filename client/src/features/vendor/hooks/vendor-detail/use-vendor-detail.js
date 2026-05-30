// @ts-check
import { api } from '@/services/api.js';
import { useQuery } from '@tanstack/react-query';

/**
 * @import { VendorDetailResponse } from '@/features/vendor/types/index.js';
 */

export const useVendorDetail = (/** @type {string | undefined} */ id) => {
  const vendorId = Number(id);

  return useQuery({
    queryKey: ['vendor-detail', vendorId],
    queryFn: async () => {
      const response = /** @type {VendorDetailResponse} */ (
        await api.get(`vendor/${vendorId}`).json()
      );

      return response;
    },
    enabled: Number.isFinite(vendorId) && vendorId > 0,
  });
};
