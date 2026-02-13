// @ts-check
import { api } from '@/services/api.js';
import { useQuery } from '@tanstack/react-query';

export function useVendorDetail(id) {
  const vendorId = Number(id);

  return useQuery({
    queryKey: ['vendor-detail', vendorId],
    queryFn: async () => {
      const response = await api.get(`vendor/${vendorId}`).json();
      console.log(response);
      return response;
    },
    enabled: Number.isFinite(vendorId) && vendorId > 0,
  });
}


