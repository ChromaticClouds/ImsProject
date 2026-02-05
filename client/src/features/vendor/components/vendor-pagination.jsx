// @ts-check

import { useLocation } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/pagination';

/**
 * 백엔드 PageInfo DTO (1-base 기준)
 * @typedef {object} PageInfo
 * @property {number} page          - 현재 페이지 (1-base)
 * @property {number} size
 * @property {number} totalPages
 * @property {number} totalElements
 */

/**
 * @typedef {object} VendorPaginationProps
 * @property {PageInfo} pageInfo
 * @property {string} basePath
 * @property {Record<string, string|number|undefined>=} extraQuery
 * @property {number=} maxButtons
 */

/**
 * shadcn/ui Pagination + react-router Link 기반 (1-base 전용)
 */
export const VendorPagination = ({
  pageInfo,
  basePath,
  extraQuery = {},
  maxButtons = 7,
}) => {
  const location = useLocation();

  if (!pageInfo || pageInfo.totalPages <= 1) return null;

  const { page, totalPages } = pageInfo;

  /** @param {number} targetPage (1-base) */
  const buildTo = (targetPage) => {
    const params = new URLSearchParams(location.search);

    Object.entries(extraQuery).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') params.delete(k);
      else params.set(k, String(v));
    });

    params.set('page', String(targetPage));
    return `${basePath}?${params.toString()}`;
  };

  const current = Math.min(Math.max(page, 1), totalPages);
  const half = Math.floor(maxButtons / 2);

  let start = Math.max(1, current - half);
  let end = start + maxButtons - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - (maxButtons - 1));
  }

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const showLeftEllipsis = start > 1;
  const showRightEllipsis = end < totalPages;

  const prevDisabled = current <= 1;
  const nextDisabled = current >= totalPages;

  return (
    <Pagination>
      <PaginationContent>
        {/* 이전 */}
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={prevDisabled}
            to={prevDisabled ? buildTo(1) : buildTo(current - 1)}
          />
        </PaginationItem>

        {/* 1 ... */}
        {showLeftEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink isActive={current === 1} to={buildTo(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {/* 중간 페이지들 */}
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={p === current} to={buildTo(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* ... 마지막 */}
        {showRightEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                isActive={current === totalPages}
                to={buildTo(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* 다음 */}
        <PaginationItem>
          <PaginationNext
            aria-disabled={nextDisabled}
            to={nextDisabled ? buildTo(totalPages) : buildTo(current + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
