// @ts-check

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';

/**
 * 페이지네이션 정보 객체
 *
 * @typedef {object} PageInfo
 * @property {number} page        - 현재 페이지 (API 기준, 1-base)
 * @property {number} totalPages - 전체 페이지 수
 */

/**
 * VendorPagination 컴포넌트 props
 *
 * @typedef {object} VendorPaginationProps
 * @property {PageInfo} pageInfo
 * @property {(page: number) => void} onChange
 */

/**
 * 거래처 목록 페이지네이션 (shadcn/ui 기반)
 *
 * - shadcn Pagination 컴포넌트 사용
 * - page 값은 항상 1-base
 */
export const VendorPagination = ({ pageInfo, onChange }) => {
  const { page, totalPages } = pageInfo;

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {/* 이전 버튼 */}
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page <= 1}
            onClick={() => {
              if (page > 1) onChange(page - 1);
            }}
          />
        </PaginationItem>

        {/* 현재 페이지 표시 (숫자 버튼) */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => onChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* 다음 버튼 */}
        <PaginationItem>
          <PaginationNext
            aria-disabled={page >= totalPages}
            onClick={() => {
              if (page < totalPages) onChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
