// @ts-check

import { usePriceSummary } from "@/features/vendor/hooks/vendor-edit/use-price-summary.js";

/**
 * 상단 KPI 타일 3개 — 공급 품목 수 / 최저 단가 / 최고 단가
 * @param {{ items: import("@/features/vendor/types/index.js").VendorProductType[] }} props
 */
export const VendorKpiRow = ({ items }) => {
  const dash = <span className='text-sm font-medium'>—</span>;

  const itemCount = items.length;

  const { minPrice, maxPrice } = usePriceSummary(items);

  return (
    <div className='grid grid-cols-3 gap-2.5 sm:gap-3'>
      {/* 공급 품목 수: 거래 의존 범위 */}
      <div className='rounded-md bg-muted/60 px-3 py-3'>
        <p className='text-xs text-muted-foreground'>공급 품목</p>
        <p className='mt-1.5 text-lg font-medium leading-none'>
          {itemCount}
          <span className='ml-0.5 text-xs font-normal text-muted-foreground'>
            개
          </span>
        </p>
      </div>

      {/* 최저 단가: 이 공급처의 가격 경쟁력 하한 */}
      <div className='rounded-md bg-muted/60 px-3 py-3'>
        <p className='text-xs text-muted-foreground'>최저 단가</p>
        {minPrice !== null ? (
          <>
            <p className='mt-1.5 text-base font-medium leading-none tabular-nums'>
              {minPrice.toLocaleString('ko-KR')}
              <span className='ml-0.5 text-xs font-normal text-muted-foreground'>
                원
              </span>
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>
              가장 저렴한 품목
            </p>
          </>
        ) : (
          <p className='mt-1.5'>{dash}</p>
        )}
      </div>

      {/* 최고 단가: 고가 품목 취급 여부 → 마진 설계 기준 */}
      <div className='rounded-md bg-muted/60 px-3 py-3'>
        <p className='text-xs text-muted-foreground'>최고 단가</p>
        {maxPrice !== null ? (
          <>
            <p className='mt-1.5 text-base font-medium leading-none tabular-nums'>
              {maxPrice.toLocaleString('ko-KR')}
              <span className='ml-0.5 text-xs font-normal text-muted-foreground'>
                원
              </span>
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>가장 비싼 품목</p>
          </>
        ) : (
          <p className='mt-1.5'>{dash}</p>
        )}
      </div>
    </div>
  );
};
