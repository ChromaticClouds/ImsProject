// @ts-check
import { CardFooter } from '@/components/ui/card.js';
import { Button } from '@/components/ui/button.js';
import { BadgeCheckIcon, BadgeMinusIcon } from 'lucide-react';

const formatNumber = (n) => Number(n || 0).toLocaleString();

/**
 * @param {{
 *  pagination: { currentPage:number, setCurrentPage:(p:number)=>any, totalPages:number },
 *  totalCount: number,
 *  summary: { orderKinds:number, totalCount:number, totalPrice:number }
 * }} props
 */
export const PurchaseOrderFooter = ({ pagination, totalCount, summary }) => {
  const { currentPage, setCurrentPage, totalPages } = pagination;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) {
    return (
      <CardFooter className='border-t'>
        <div className='w-full flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            <span>{totalCount}건</span>
            <span className='ml-4'>총수량 {formatNumber(summary?.totalCount)}</span>
          </div>
          <div className='text-xs text-muted-foreground'>1 / 1</div>
        </div>
      </CardFooter>
    );
  }

  return (
    <CardFooter className='border-t'>
      <div className='w-full grid grid-cols-3 items-center gap-4'>
        <div className='justify-self-start text-sm text-muted-foreground'>
          <span>{totalCount}건</span>
          <span className='ml-4'>총수량 {formatNumber(summary?.totalCount)}</span>
          <span> <BadgeMinusIcon />: 입고 대기 / <BadgeCheckIcon />: 입고 완료</span>
        </div>

        <div className='justify-self-center'>
          <div className='flex items-center gap-2'>
            <Button type='button' size='sm' variant='secondary' disabled={!canPrev} onClick={() => setCurrentPage(currentPage - 1)}>
              이전
            </Button>

            {pages.map((p) => (
              <Button
                key={p}
                type='button'
                size='sm'
                variant={p === currentPage ? 'default' : 'secondary'}
                className={p === currentPage ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </Button>
            ))}

            <Button type='button' size='sm' variant='secondary' disabled={!canNext} onClick={() => setCurrentPage(currentPage + 1)}>
              다음
            </Button>
          </div>
        </div>

        <div className='justify-self-end text-xs text-muted-foreground'>
          {currentPage} / {totalPages}
        </div>
      </div>
    </CardFooter>
  );
};
