// @ts-check

import { Button } from '@/components/ui/button.js';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.js';
import { ChevronDownIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useState } from 'react';

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

/** @param {{ src?: string, alt?: string, size?: number }} props */
export function ZoomImage({ src, alt, size = 48 }) {
  const safeSrc = typeof src === 'string' ? src.trim() : '';
  const [open, setOpen] = useState(false);

  const boxStyle = useMemo(
    () => ({ width: size, height: size, minWidth: size, minHeight: size }),
    [size],
  );

  // ✅ 이미지가 없어도 "박스는 항상 고정" (레이아웃 흔들림 방지)
  if (!safeSrc) {
    return (
      <div
        style={boxStyle}
        className='shrink-0 overflow-hidden rounded-md border bg-muted'
      />
    );
  }

  //   return (
  //     <Dialog open={open} onOpenChange={setOpen}>
  //       <DialogTrigger asChild>
  //         <button
  //           type="button"
  //           className="group relative h-12 w-12 overflow-hidden rounded-md border bg-muted"
  //           onMouseDown={(e) => e.stopPropagation()}
  //           onClick={(e) => e.stopPropagation()}
  //           aria-label="이미지 확대"
  //           title="클릭하여 확대"
  //         >
  //           <img
  //             src={safeSrc}
  //             alt={alt ?? ''}
  //             className="h-full w-full object-cover transition-transform group-hover:scale-105"
  //             loading="lazy"
  //             onError={(e) => {
  //               // 이미지가 깨지면 썸네일만 숨김
  //               e.currentTarget.style.display = 'none';
  //             }}
  //           />
  //         </button>
  //       </DialogTrigger>

  //       <DialogContent
  //         className="max-w-[92vw] p-0"
  //         onOpenAutoFocus={(e) => e.preventDefault()}
  //       >
  //         {/* 큰 이미지 클릭하면 닫힘 */}
  //         <button
  //           type="button"
  //           className="block w-full"
  //           onClick={() => setOpen(false)}
  //           aria-label="닫기"
  //           title="클릭하여 닫기"
  //         >
  //           <img
  //             src={safeSrc}
  //             alt={alt ?? ''}
  //             className="max-h-[85vh] w-full object-contain"
  //           />
  //         </button>
  //       </DialogContent>
  //     </Dialog>
  //   );
  // }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <button
          type='button'
          style={boxStyle}
          className='shrink-0 overflow-hidden rounded-md border bg-muted'
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          aria-label='이미지 확대'
          title='클릭하여 확대'
        >
          <img
            src={safeSrc}
            alt={alt ?? ''}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'cover',
            }}
            loading='lazy'
            onError={(e) => {
              e.currentTarget.src = '';
            }}
          />
        </button>
      </DialogTrigger>

      <DialogContent
        className='max-w-[92vw] p-0'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <button
          type='button'
          className='block w-full'
          onClick={() => setOpen(false)}
          aria-label='닫기'
        >
          <img
            src={safeSrc}
            alt={alt ?? ''}
            className='max-h-[85vh] w-full object-contain'
            style={{ display: 'block' }}
          />
        </button>
      </DialogContent>
    </Dialog>
  );
}

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
                  className='grid min-h-14 grid-cols-12 items-center border-t px-3 py-2 text-sm'
                >
                  {/* 품목명 + 이미지 */}
                  <div className='col-span-4 flex items-center gap-3'>
                    <ZoomImage
                      src={it.imageUrl ?? ''}
                      alt={it.productName}
                    />
                    <div className='min-w-0'>
                      <div className='truncate'>
                        {it.productName ?? `상품ID ${it.productId}`}
                      </div>
                    </div>
                  </div>

                  <div className='col-span-2 flex items-center justify-center'>
                    {formatType(it.type)}
                  </div>
                  <div className='col-span-2 flex items-center justify-center text-center'>
                    {it.brand ?? '-'}
                  </div>
                  <div className='col-span-2 flex items-center justify-center'>
                    {it.safetyStock}
                  </div>
                  <div className='col-span-2 flex items-center justify-center'>
                    {it.count ?? 0}
                  </div>
                </div>
              ))
            ) : (
              <div className='px-3 py-6 text-center text-sm text-muted-foreground'>
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
