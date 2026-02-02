// @ts-check
import { useQuery } from '@tanstack/react-query';

export function useVendorDetail(id) {
  return useQuery({
    queryKey: ['vendor-detail', id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/vendor/${id}`);

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        // 서버가 JSON 에러를 주면 text에 담김, HTML이면 HTML, 아무것도 없으면 빈 문자열
        throw new Error(`GET /vendor/${id} ${res.status} ${res.statusText} :: ${text}`);
      }

      return res.json();
    },
    enabled: !!id,
  });
}

