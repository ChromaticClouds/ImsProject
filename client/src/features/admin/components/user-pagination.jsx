import { CardFooter } from '@/components/ui/card.js';
import { useUserList } from './user-provider.jsx';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.js';

const BASE_PATH = '/dashboard/user/setting';

export const UserPagination = () => {
  const { page, totalPages, isFirst, isLast } = useUserList();

  if (totalPages <= 1) return null;

  return (
    <CardFooter>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              to={`${BASE_PATH}?page=${page - 1}`}
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
                  to={`${BASE_PATH}?page=${p}`}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              to={`${BASE_PATH}?page=${page + 1}`}
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
