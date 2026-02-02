// @ts-check

import { useSearchParams } from 'react-router-dom';

/**
 * @typedef {object} VendorSearch
 * @property {number} page
 * @property {string=} type
 * @property {string=} keyword
 */

/**
 * 페이지 기본값
 * - query string에 page가 없을 경우 사용
 */
const DEFAULT_PAGE = 1;

/**
 * 거래처 검색 상태를 URL(query string) 기반으로 관리하는 커스텀 훅
 * URL → 검색 조건 객체로 변환
 */
export const useVendorSearch = () => {
  const [params, setParams] = useSearchParams();

  const search = /** @type {VendorSearch} */ ({
    page: Number(params.get('page') ?? DEFAULT_PAGE),
    type: params.get('type') || undefined,
    keyword: params.get('keyword') || undefined,
  });

  /**
   * @param {Partial<VendorSearch>} next
   */
  const setSearch = (next) => {
    const merged = { ...search, ...next };

    setParams({
      page: String(Math.max(merged.page ?? DEFAULT_PAGE, DEFAULT_PAGE)),
      ...(merged.type && { type: merged.type }),
      ...(merged.keyword && { keyword: merged.keyword }),
    });
  };

  return { search, setSearch };
};
