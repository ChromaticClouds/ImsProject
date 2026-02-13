// @ts-check
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export const PurchaseOrderPagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  return (
    <div className='w-full pt-4'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage !== 1 && (
              <PaginationPrevious to='#' onClick={() => setCurrentPage((p) => p - 1)} />
            )}
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  to='#'
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            {currentPage !== totalPages && (
              <PaginationNext to='#' onClick={() => setCurrentPage((p) => p + 1)} />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
