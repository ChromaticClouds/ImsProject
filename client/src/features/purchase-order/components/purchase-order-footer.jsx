// @ts-check
import { CardFooter } from '@/components/ui/card.js';
import { Button } from '@/components/ui/button.js';
import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';
import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';

export const PurchaseOrderFooter = ({ pagination, totalCount }) => {
  const { view } = usePurchaseOrderFilterStore();
  const { summaryDraft, summarySent } = usePurchaseOrders();

  const s = view === 'SENT' ? summarySent : summaryDraft;

  const { currentPage, setCurrentPage, totalPages } = pagination;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <CardFooter className='border-t'>
      <div className='w-full grid grid-cols-3 items-center gap-4'>
        {/* 왼쪽 */}
        <div className='justify-self-start text-sm text-muted-foreground'>
          <span>{totalCount}건</span>
          <span className='ml-4'>총수량 {s.totalCount}</span>
        </div>

        {/* 가운데 */}
        <div className='justify-self-center'>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              size='sm'
              variant='secondary'
              disabled={!canPrev}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              이전
            </Button>

            {pages.map((p) => (
              <Button
                key={p}
                type='button'
                size='sm'
                variant={p === currentPage ? 'default' : 'secondary'}
                className={
                  p === currentPage
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : ''
                }
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </Button>
            ))}

            <Button
              type='button'
              size='sm'
              variant='secondary'
              disabled={!canNext}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              다음
            </Button>
          </div>
        </div>

        {/* 오른쪽 */}
        <div className='justify-self-end text-xs text-muted-foreground'>
          {currentPage} / {totalPages}
        </div>
      </div>
    </CardFooter>
  );
};
