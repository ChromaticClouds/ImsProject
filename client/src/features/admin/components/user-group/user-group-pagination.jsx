// @ts-check
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.js';

import { getPagination } from '@/helpers/index.js';
import { useSearchParams } from 'react-router-dom';

import { useUserGroupParams } from '../../hooks/use-user-group-params.js';
import { useGetUserGroup } from '../../hooks/use-get-user-group.js';

export const UserGroupPagination = () => {
  const [params] = useSearchParams();

  const { query } = useUserGroupParams();
  const { data } = useGetUserGroup(query);

  const {
    page = 1,
    totalPages = 1,
    isFirst = true,
    isLast = true,
  } = data ?? {};

  const items = getPagination(page, totalPages, 5);

  /** @param {number} n */
  const toPage = (n) => {
    const p = new URLSearchParams(params);
    p.set('page', String(n));
    return `/dashboard/user/group?${p.toString()}`;
  };

  if (data?.totalPages < 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={toPage(Math.max(1, data?.page - 1))}
            onClick={(e) => isFirst && e.preventDefault()}
            aria-disabled={isFirst}
            className={isFirst ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {items.map((it, idx) => (
          <PaginationItem key={`${it}-${idx}`}>
            {it === -1 ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                to={toPage(it)}
                isActive={it === page}
              >
                {it}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            to={toPage(Math.min(totalPages, page + 1))}
            onClick={(e) => isLast && e.preventDefault()}
            aria-disabled={isLast}
            className={isLast ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
