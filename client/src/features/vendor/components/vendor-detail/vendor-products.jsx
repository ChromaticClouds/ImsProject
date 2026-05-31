// @ts-check

import { PackageIcon, BottleWineIcon } from 'lucide-react';

/**
 * Types
 * @import { VendorProductType } from '@/features/vendor/types/index.js';
 */

/**
 * 빈 상태
 * @param {{ message: string }} props
 */
const EmptyState = ({ message }) => {
  return (
    <div className='flex min-h-36 flex-col items-center justify-center gap-2 rounded-md bg-muted/20 text-muted-foreground'>
      <PackageIcon
        className='size-5'
        aria-hidden='true'
      />
      <p className='text-sm'>{message}</p>
    </div>
  );
};

/** @param {number | null | undefined} value */
const money = (value) =>
  `${Number(value ?? 0).toLocaleString('ko-KR')}원`;

/**
 * 공급 품목 행
 * @param {{ item: VendorProductType }} props
 */
const ProductRow = ({ item }) => {
  const meta = [item.brand, item.type].filter(Boolean).join(' · ') || '—';

  return (
    <div className='flex items-center gap-3 border-b py-2.5 last:border-b-0'>
      {/* 썸네일 */}
      <div className='flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40'>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className='size-full object-cover'
          />
        ) : (
          <BottleWineIcon
            className='size-4 text-muted-foreground'
            aria-hidden='true'
          />
        )}
      </div>

      {/* 품목 정보 */}
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>
          {item.productName ?? '—'}
        </p>
        <p className='mt-0.5 truncate text-xs text-muted-foreground'>{meta}</p>
      </div>

      {/* 단가 */}
      <p className='shrink-0 text-sm font-medium tabular-nums'>
        {money(item.purchasePrice)}
      </p>
    </div>
  );
}

/**
 * @param {{ items: VendorProductType[] }} props
 */
export const VendorProducts = ({ items }) => {
  return (
    <div className='rounded-lg border bg-card'>
      <div className='flex items-center justify-between border-b px-5 py-4'>
        <div>
          <h2 className='text-sm font-medium'>공급 품목</h2>
          <p className='mt-0.5 text-xs text-muted-foreground'>구매 단가 기준</p>
        </div>
        <PackageIcon
          className='size-4 text-muted-foreground'
          aria-hidden='true'
        />
      </div>
      <div className='max-h-80 overflow-y-auto px-5 py-3'>
        {items.length === 0 ? (
          <EmptyState message='등록된 공급 품목이 없습니다.' />
        ) : (
          items.map((item) => (
            <ProductRow
              key={item.productId ?? item.productName}
              item={item}
            />
          ))
        )}
      </div>
    </div>
  );
};
