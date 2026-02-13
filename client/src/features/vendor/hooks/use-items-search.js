// // @ts-check
// import { useQuery } from '@tanstack/react-query';
// import { fetchProducts } from '../api/index';

// /**
//  * @param {{ keyword: string, excludeAssigned?: boolean, currentVendorId: number }} params
//  */
// export function useItemsSearch(params) {
//   return useQuery({
//     // 캐시 키는 products로 맞추는 걸 추천
//     queryKey: ['products', params],
//     queryFn: () => fetchProducts({ keyword: params.keyword, excludeAssigned: params.excludeAssigned }),
//     enabled: !!params.keyword && params.keyword.trim().length > 0,
//     staleTime: 30 * 1000,
//   });
// }

// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/index';

/**
 * @param {{ keyword: string, excludeAssigned?: boolean, currentVendorId?: number }} params
 */
export function useItemsSearch(params) {
  const keyword = params.keyword?.trim() ?? '';
  const excludeAssigned = params.excludeAssigned ?? true;
  const currentVendorId = params.currentVendorId;

  return useQuery({
  
    queryKey: ['products', keyword, excludeAssigned, currentVendorId ?? null],
    queryFn: () =>
      fetchProducts({
        keyword,
        excludeAssigned,
        currentVendorId,
      }),
    enabled: keyword.length > 0,
    staleTime: 30 * 1000,
  });
}
