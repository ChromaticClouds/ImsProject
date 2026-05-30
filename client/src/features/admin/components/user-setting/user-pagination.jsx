import { CardFooter } from '@/components/ui/card.js';
import { useUserListQuery } from '../../hooks/use-user-list-query.js';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.js';
import { useSearchParams } from 'react-router-dom';

/**
 * @param {{ prefix: string }} props 
 */
export const UserPagination = ({ prefix }) => {
  const [params] = useSearchParams();
  const { page, totalPages, isFirst, isLast } = useUserListQuery();

  /** @param {number} nextPage */
  const toPage = (nextPage) => {
    const p = new URLSearchParams(params);
    p.set('page', String(nextPage));
    return `${prefix}?${p.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <CardFooter>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              to={toPage(page - 1)}
              onClick={(e) => isFirst && e.preventDefault()}
              aria-disabled={isFirst}
              className={isFirst ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;

            return (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  to={toPage(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              to={toPage(page + 1)}
              onClick={(e) => isLast && e.preventDefault()}
              aria-disabled={isLast}
              className={isLast ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </CardFooter>
  );
};
