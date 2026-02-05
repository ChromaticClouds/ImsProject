// @ts-check

/**
 * @typedef {object} PaginationProps
 * @property {number} currentPage
 * @property {number} totalPages
 * @property {React.Dispatch<React.SetStateAction<number>>} setCurrentPage
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
export const NoticePagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  // 페이지가 0~1이면 페이징 UI 안 보여줌 (실무에서 많이 씀)
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className='w-full pt-4'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage !== 1 && (
              <PaginationPrevious
                to='#'
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => p - 1);
                }}
              />
            )}
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  to='#'
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            {currentPage !== totalPages && (
              <PaginationNext
                to='#'
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => p + 1);
                }}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
