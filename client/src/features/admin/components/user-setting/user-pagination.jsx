import { CardFooter } from '@/components/ui/card.js';
import { useUserList } from '../../providers/user-provider.jsx';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.js';

/**
 * @param {{ prefix: string }} props 
 */
export const UserPagination = ({ prefix }) => {
  const { page, totalPages, isFirst, isLast } = useUserList();

  if (totalPages <= 1) return null;

  return (
    <CardFooter>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              to={`${prefix}?page=${page - 1}`}
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
                  to={`${prefix}?page=${p}`}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              to={`${prefix}?page=${page + 1}`}
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
