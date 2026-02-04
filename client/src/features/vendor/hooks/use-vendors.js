import { useQuery } from '@tanstack/react-query';
import { fetchVendors } from '@/services/api';

/**
 * 거래처 목록을 조회하는 서버 상태 훅
 *
 * - 검색 조건(search)을 queryKey에 포함하여 캐시 분리
 * - 페이지 이동 시 이전 데이터 유지 (UX 개선)
 * - 일정 시간(staleTime) 동안 캐시 재사용
 *
 * @param {VendorSearch} search - 거래처 검색 조건
 *
 * @returns {import('@tanstack/react-query').UseQueryResult<
 *   VendorListResponse,
 *   Error
 * >}
 */
export function useVendors(search) {
  return useQuery({
    queryKey: ['vendors', search],
    queryFn: () => fetchVendors(search),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,

    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}
