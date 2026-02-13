// @ts-check

/**
 * @typedef {object} PaginationProps
 * @property {number} currentPage
 * @property {number} totalPages
 */

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

/**
 * @param {PaginationProps} props
 */
export const NoticePagination = ({ currentPage, totalPages }) => {
  // 페이지가 0~1이면 페이징 UI 안 보여줌 (실무에서 많이 씀)
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className='w-full pt-4'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage !== 1 && (
              <PaginationPrevious
                to={`/dashboard/notice?page=${currentPage - 1}`}
              />
            )}
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                   to={`/dashboard/notice?page=${page}`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            {currentPage !== totalPages && (
              <PaginationNext
                to={`/dashboard/notice?page=${currentPage + 1}`}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
