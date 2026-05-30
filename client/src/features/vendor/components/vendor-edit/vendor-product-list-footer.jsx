// @ts-check

import { AlertCircleIcon } from 'lucide-react';

/**
 * @param {{
 *   hasNoItems: boolean;
 *   hasMissingPrice: boolean;
 *   itemCount: number;
 *   totalPrice: number;
 * }} props
 */
export const VendorProductListFooter = ({
  hasNoItems,
  hasMissingPrice,
  itemCount,
  totalPrice,
}) => {
  const hasAlert = hasNoItems || hasMissingPrice;

  return (
    <>
      {hasAlert ? (
        <span className='flex items-center gap-1.5 text-xs text-destructive'>
          <AlertCircleIcon
            className='size-3.5'
            aria-hidden='true'
          />
          {hasNoItems
            ? '품목을 최소 1개 이상 추가해야 합니다.'
            : '단가를 입력하지 않은 품목이 있습니다.'}
        </span>
      ) : (
        <span className='text-xs text-muted-foreground'>
          {itemCount}개 품목
        </span>
      )}

      {itemCount > 0 && (
        <div className='flex items-baseline gap-1'>
          <span className='text-xs text-muted-foreground'>단가 합계</span>
          <span className='text-sm font-medium tabular-nums'>
            {totalPrice.toLocaleString('ko-KR')}
          </span>
          <span className='text-xs text-muted-foreground'>원</span>
        </div>
      )}
    </>
  );
};
