// @ts-check

import { BottleWineIcon, CheckIcon, PlusIcon } from 'lucide-react';

/**
 * @import { VendorProductType } from '@/features/vendor/types/index.js';
 *
 * @param {{ result: VendorProductType; isSelected: boolean; onSelect: () => void }} props
 */
export const VendorProductSearchItem = ({ result, isSelected, onSelect }) => (
  <div
    role='option'
    aria-selected={isSelected}
    onMouseDown={(e) => {
      e.preventDefault();
      onSelect();
    }}
    className={[
      'flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors',
      isSelected ? 'bg-blue-50 dark:bg-blue-950' : 'hover:bg-muted/60',
    ].join(' ')}
  >
    <div className='flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40'>
      {result.imageUrl ? (
        <img
          src={result.imageUrl}
          alt={result.productName}
          className='size-full object-cover'
        />
      ) : (
        <BottleWineIcon
          className='size-4 text-muted-foreground'
          aria-hidden='true'
        />
      )}
    </div>

    <div className='min-w-0 flex-1'>
      <p
        className={[
          'truncate text-sm font-medium',
          isSelected ? 'text-blue-900 dark:text-blue-100' : '',
        ].join(' ')}
      >
        {result.productName}
      </p>
      <span className='text-xs text-muted-foreground'>
        {result.brand} · {result.type}
      </span>
    </div>

    <div className='shrink-0 text-right'>
      <p className='text-xs text-muted-foreground'>기준 단가</p>
      <p className='text-sm font-medium tabular-nums'>
        {result.purchasePrice.toLocaleString('ko-KR')}원
      </p>
    </div>

    <div className='flex size-5 shrink-0 items-center justify-center'>
      {isSelected ? (
        <CheckIcon
          className='size-4 text-blue-600 dark:text-blue-400'
          aria-label='선택됨'
        />
      ) : (
        <PlusIcon
          className='size-4 text-muted-foreground'
          aria-hidden='true'
        />
      )}
    </div>
  </div>
);
