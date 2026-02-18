// @ts-check

/**
 * Components
 */
import { CardFooter } from '@/components/ui/card.js';
import { Button } from '@/components/ui/button.js';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';

/**
 * Hooks
 */
import { usePoParamStore } from '@/features/purchase-order/stores/use-po-param-store.js';
import { useShallow } from 'zustand/shallow';
import { usePoListContext } from '@/features/purchase-order/providers/po-list-provider.jsx';
import { PoListSummary } from '@/features/purchase-order/components/purchase-order/po-list-summary.jsx';

/**
 * Helper
 */
import { getEllipsisPages } from '@/features/purchase-order/helpers/get-window-pages.js';

export const PurchaseOrderFooter = () => {
  const [page, setPage] = usePoParamStore(
    useShallow((s) => [s.page, s.setPage]),
  );

  const { page: pageMeta } = usePoListContext();

  const canPrev = page > 1;
  const canNext = page < pageMeta?.totalPages;

  const pages = getEllipsisPages(page, pageMeta?.totalPages, 5);

  return (
    <CardFooter className='border-t overflow-x-hidden'>
      <div className='w-full grid grid-cols-1 md:grid-cols-3 items-center gap-4'>
        <PoListSummary />

        <Pagination className='w-full'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                to='#'
                onClick={() => setPage(page - 1)}
                aria-disabled={!canPrev}
                className={!canPrev ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {pages.map((p, i) => (
              <PaginationItem key={`${p}-${i}`}>
                {typeof p === 'string' ? (
                  <span className='px-2 text-muted-foreground'>…</span>
                ) : (
                  <PaginationLink
                    to='#'
                    isActive={p === page}
                    onClick={(e) => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                to='#'
                onClick={() => setPage(page + 1)}
                aria-disabled={!canNext}
                className={!canNext ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className='justify-self-end text-xs text-muted-foreground hidden md:block'>
          {page} / {pageMeta?.totalPages}
        </div>
      </div>
    </CardFooter>
  );
};
