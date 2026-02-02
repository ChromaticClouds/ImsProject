// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/api';

/**
 * @param {{ keyword: string, excludeAssigned?: boolean }} params
 */
export function useItemsSearch(params) {
  return useQuery({
    // 캐시 키는 products로 맞추는 걸 추천
    queryKey: ['products', params],
    queryFn: () => fetchProducts({ keyword: params.keyword, excludeAssigned: params.excludeAssigned }),
    enabled: !!params.keyword && params.keyword.trim().length > 0,
    staleTime: 30 * 1000,
  });
}

