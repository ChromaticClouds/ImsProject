// @ts-check
import { useQuery } from '@tanstack/react-query';

export function useVendorDetail(id) {
  const vendorId = Number(id);

  return useQuery({
    queryKey: ['vendor-detail', vendorId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/vendor/${vendorId}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`GET /vendor/${vendorId} ${res.status} ${res.statusText} :: ${text}`);
      }

      return res.json();
    },
    enabled: Number.isFinite(vendorId) && vendorId > 0,
    refetchOnMount: 'always',
  });
}


