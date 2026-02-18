// @ts-check

import { Button } from '@/components/ui/button.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.js';
import { ChevronDownIcon } from 'lucide-react';

const typeLabelMap = {
  SOJU: '소주',
  LIQUOR: '양주',
  KAOLIANG_LIQUOR: '고량주',
  TRADITIONAL: '전통주',
  WHISKEY: '위스키',
};

/** @param {ProductType} type */
const formatType = (type) => typeLabelMap[type] ?? type ?? '-';

/** @param {number} v */
const formatSafetyStock = (v) => {
  if (v == null) return '-';
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return n.toFixed(1);
};

/**
 * @param {{ content: OrderRequest }} param0 
 */
export const PoProductDetail = ({ content }) => {
  const items = content?.items ?? [];
  const itemCountLabel = `${Number(content.itemKinds ?? items.length ?? 0)}개`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='gap-2'
        >
          {itemCountLabel}
          <ChevronDownIcon className='w-4 h-4' />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align='start'
        className='w-130 p-4'
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className='flex flex-col gap-3'>
          <div className='text-sm font-semibold'>발주 품목 상세</div>

          <div className='rounded-lg border overflow-hidden'>
            <div className='grid grid-cols-12 text-xs font-medium bg-muted px-3 py-2'>
              <div className='col-span-4'>품목명</div>
              <div className='col-span-2 text-center'>주종</div>
              <div className='col-span-2 text-center'>브랜드</div>
              <div className='col-span-2 text-center'>안전재고</div>
              <div className='col-span-2 text-center'>발주수량</div>
            </div>

            {items.length ? (
              items.map((it) => (
                <div
                  key={it.orderId}
                  className='grid grid-cols-12 px-3 py-2 text-sm border-t'
                >
                  <div className='col-span-4 truncate'>
                    {it.productName ?? `상품ID ${it.productId}`}
                  </div>
                  <div className='col-span-2 text-center'>
                    {formatType(it.type)}
                  </div>
                  <div className='col-span-2 text-center'>
                    {it.brand ?? '-'}
                  </div>
                  <div className='col-span-2 text-center'>
                    {formatSafetyStock(it.safetyStock) ?? 0}
                  </div>
                  <div className='col-span-2 text-center'>{it.count ?? 0}</div>
                </div>
              ))
            ) : (
              <div className='px-3 py-6 text-sm text-muted-foreground text-center'>
                등록된 발주 품목이 없습니다
              </div>
            )}
          </div>

          <div className='text-xs text-muted-foreground'>
            합계 수량: {content.totalCount}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
