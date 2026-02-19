// @ts-check
import React, { useMemo, useState } from 'react';
import { useInboundSafetyStocks } from '../hooks/use-inbound-safety-stocks.js';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.js';

/** @param {{ src?: string, alt?: string, size?: number }} props */
export function ZoomImage({ src, alt, size = 40 }) {
  const safeSrc = typeof src === 'string' ? src.trim() : '';
  const [open, setOpen] = useState(false);

  const boxStyle = useMemo(
    () => ({ width: size, height: size, minWidth: size, minHeight: size }),
    [size]
  );

  if (!safeSrc) {
    return (
      <div
        style={boxStyle}
        className="shrink-0 overflow-hidden rounded-md border bg-muted"
        title="이미지 없음"
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          style={boxStyle}
          className="shrink-0 overflow-hidden rounded-md border bg-muted"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          aria-label="이미지 확대"
          title="클릭하여 확대"
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
            loading="lazy"
            onError={(e) => {
              // 깨지면 placeholder로
              e.currentTarget.src = '';
            }}
          />
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-w-[92vw] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <button
          type="button"
          className="block w-full"
          onClick={() => setOpen(false)}
          aria-label="닫기"
          title="클릭하여 닫기"
        >
          <img
            src={safeSrc}
            alt={alt ?? ''}
            className="max-h-[85vh] w-full object-contain"
            style={{ display: 'block' }}
          />
        </button>
      </DialogContent>
    </Dialog>
  );
}

/**
 * @param {{
 *  items: import('../types').InboundPendingItem[],
 *  qtyLabel?: string,
 * }} props
 */
export function InboundPendingItemsDropdown({ items, qtyLabel = '발주수량' }) {
  const list = Array.isArray(items) ? items : [];

  const productIds = useMemo(() => {
    const s = new Set();
    for (const it of list) {
      const pid = Number(it.productId);
      if (Number.isFinite(pid) && pid > 0) s.add(pid);
    }
    return Array.from(s);
  }, [list]);

  /** @param {string} type */
  function toKoreanType(type) {
    switch (type) {
      case 'SOJU':
        return '소주';
      case 'WHISKEY':
        return '위스키';
      case 'LIQUOR':
        return '양주';
      case 'TRADITIONAL':
        return '전통주';
      case 'KAOLIANG_LIQUOR':
        return '고량주';
      default:
        return type ?? '-';
    }
  }

  const safeQ = useInboundSafetyStocks({
    productIds,
    enabled: productIds.length > 0,
  });

  const safeMap =
    safeQ.data && typeof safeQ.data === 'object' ? safeQ.data : {};

  const merged = useMemo(() => {
    return list.map((it) => {
      const pid = Number(it.productId);
      const row = safeMap?.[String(pid)];
      return { ...it, safetyStock: row?.safetyStock };
    });
  }, [list, safeMap]);

  const formatSafety = (v) => {
    if (v == null) return '-';
    const n = Number(v);
    // 서버가 CEIL로 줘서 정수일 가능성이 높지만, 혹시 소수로 오면 그대로 표시
    return Number.isFinite(n) ? n.toLocaleString() : String(v);
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background">
      {/* 헤더 */}
      <div className="grid grid-cols-12 items-center border-b bg-muted/50 px-3 py-2 text-[11px] font-semibold text-muted-foreground sticky top-0 z-10">
        <div className="col-span-7">품목</div>
        <div className="col-span-3 text-right">안전재고</div>
        <div className="col-span-2 text-right">{qtyLabel}</div>
      </div>

      <div className="max-h-[320px] overflow-auto">
        {merged.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            품목이 없습니다.
          </div>
        ) : (
          merged.map((i) => (
            <div
              key={i.orderId}
              className="grid grid-cols-12 items-center gap-2 px-3 py-2 text-sm border-b last:border-b-0 hover:bg-muted/30 transition-colors"
            >
              {/* 품목 */}
              <div className="col-span-7 min-w-0 flex items-center gap-3">
                <ZoomImage
                  src={i.imageUrl ?? ''}
                  alt={i.productName ?? ''}
                  size={40}
                />
                <div className="min-w-0">
                  <div className="truncate font-medium" title={i.productName ?? ''}>
                    {i.productName ?? '-'}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                    <span className="rounded-md border bg-background px-1.5 py-0.5">
                      {toKoreanType(i.type)}
                    </span>
                    <span className="rounded-md border bg-background px-1.5 py-0.5">
                      {i.brand ?? '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 안전재고 */}
              <div className="col-span-3 text-right">
                {safeQ.isFetching ? (
                  <span className="text-xs text-muted-foreground">불러오는 중...</span>
                ) : (
                  <span className="font-semibold tabular-nums">
                    {formatSafety(i.safetyStock)}
                  </span>
                )}
              </div>

              {/* 수량 */}
              <div className="col-span-2 text-right">
                <span className="font-semibold tabular-nums">
                  {Number(i.orderQty ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
