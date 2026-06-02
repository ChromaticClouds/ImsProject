import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

const MAX_VISIBLE_PAGES = 5;

const getPageHref = (page: number) => `?page=${page}`;

const getVisiblePages = (page: number, totalPages: number) => {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  const start = Math.min(
    Math.max(page - half, 1),
    totalPages - MAX_VISIBLE_PAGES + 1,
  );

  return Array.from({ length: MAX_VISIBLE_PAGES }, (_, index) => start + index);
};

export const NoticeListPagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}) => {
  const currentPage = Math.min(Math.max(page, 1), totalPages || 1);
  const pages = getVisiblePages(currentPage, totalPages);
  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={getPageHref(currentPage - 1)}
            aria-label='이전 페이지'
            aria-disabled={isPreviousDisabled}
            className={cn(
              'size-8 px-0 sm:pl-0',
              isPreviousDisabled && 'pointer-events-none opacity-50',
            )}
            onClick={(event) => {
              event.preventDefault();

              if (!isPreviousDisabled) {
                onPageChange?.(currentPage - 1);
              }
            }}
          />
        </PaginationItem>
        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              to={getPageHref(pageNumber)}
              isActive={pageNumber === currentPage}
              className='size-8'
              onClick={(event) => {
                event.preventDefault();
                onPageChange?.(pageNumber);
              }}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            to={getPageHref(currentPage + 1)}
            aria-label='다음 페이지'
            aria-disabled={isNextDisabled}
            className={cn(
              'size-8 px-0 sm:pr-0',
              isNextDisabled && 'pointer-events-none opacity-50',
            )}
            onClick={(event) => {
              event.preventDefault();

              if (!isNextDisabled) {
                onPageChange?.(currentPage + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
