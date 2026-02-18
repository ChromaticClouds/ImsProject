// @ts-check

/**
 * Components
 */
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.js';

/**
 * Helpers
 */
import { getPagination } from '@/helpers/index.js';

/**
 * Hooks
 */
import { useRoListContext } from '@/features/receive-order/providers/ro-list-provider.jsx';
import { useSearchParams } from 'react-router-dom';

export const ReceiveOrderPagination = () => {
  const { content, ...p } = useRoListContext();

  const [params] = useSearchParams();

  const page = Number(params.get('page') ?? 1) || 1;
  const items = getPagination(page, p.totalPages ?? 1, 5);

  /** @param {number} n */
  const toPage = (n) => `/dashboard/receive-order?page=${n}`;

  return p.totalPages >= 1 && (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={toPage(Math.max(1, page - 1))}
            onClick={(e) => p.isFirst && e.preventDefault()}
            aria-disabled={p.isFirst}
            className={p.isFirst ? 'pointer-events-none opacity-50' : ''}
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
            to={toPage(Math.min(p.totalPages, page + 1))}
            onClick={(e) => p.isLast && e.preventDefault()}
            aria-disabled={p.isLast}
            className={p.isLast ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
