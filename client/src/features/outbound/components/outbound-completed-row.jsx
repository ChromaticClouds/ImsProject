// @ts-check
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useOutboundCompletedItems } from '../hooks/use-outbound-completed-items';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.js';

/** @param {string} type */
function toKoreanType(type) {
  switch (type) {
    case 'SOJU': return '소주';
    case 'WHISKEY': return '위스키';
    case 'LIQUOR': return '양주';
    case 'TRADITIONAL': return '전통주';
    case 'KAOLIANG_LIQUOR': return '고량주';
    default: return type ?? '-';
  }
}

/**
 * 날짜 + 요일 표시
 * 
 * @param {string | null | undefined} dateStr
 */
function formatDateWithDay(dateStr) {
  if (!dateStr || dateStr === '-') return '-';

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr; // 파싱 실패 시 원본 유지

  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const day = week[d.getDay()];
  const dateOnly = String(dateStr).length >= 10 ? String(dateStr).slice(0, 10) : String(dateStr);

  return `${dateOnly} (${day})`;
}


/** @param {{ src?: string, alt?: string, size?: number }} props */
function ZoomImage({ src, alt, size = 40 }) {
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
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            loading="lazy"
            onError={(e) => {
              // 깨지면 placeholder로 전환
              e.currentTarget.src = '';
            }}
          />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[92vw] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
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
 * @param {{ items: any[] }} props
 */
function OutboundCompletedItemsDropdown({ items }) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background shadow-lg">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 grid grid-cols-12 gap-2 border-b bg-muted/30 px-3 py-2 text-[11px] font-semibold text-muted-foreground">
        <div className="col-span-8">품목</div>
        <div className="col-span-4 text-right">출고수량</div>
      </div>

      <div className="max-h-[320px] overflow-auto">
        {!list.length ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">품목 없음</div>
        ) : (
          <div className="divide-y">
            {list.map((it) => (
              <div
                key={it.orderId}
                className="grid grid-cols-12 items-center gap-2 px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
              >
                {/* ✅ 이미지 + 품목 */}
                <div className="col-span-8 min-w-0 flex items-center gap-3">
                  <ZoomImage src={it.imageUrl ?? ''} alt={it.productName ?? ''} size={40} />

                  <div className="min-w-0">
                    <div className="truncate font-semibold" title={it.productName ?? ''}>
                      {it.productName ?? '-'}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                      <span className="rounded-md border bg-background px-1.5 py-0.5">
                        {toKoreanType(it.type)}
                      </span>
                      <span className="rounded-md border bg-background px-1.5 py-0.5">
                        {it.brand ?? '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 출고수량 */}
                <div className="col-span-4 text-right text-xs tabular-nums">
                  <span className="text-muted-foreground">출고수량 </span>
                  <span className="font-semibold text-foreground">
                    {Number(it.orderQty ?? it.outboundQty ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @param {{
 *  row: any,
 *  loading: boolean,
 * }} props
 */
export function OutboundCompletedRow({ row, loading }) {
  const [isOpen, setIsOpen] = useState(false);

  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  const [dropdownWidth, setDropdownWidth] = useState(360);
  const MIN_DROPDOWN_WIDTH = 360;

  const itemsQuery = useOutboundCompletedItems(row.orderNumber, isOpen);
  const items = useMemo(
    () => (Array.isArray(itemsQuery.data) ? itemsQuery.data : []),
    [itemsQuery.data]
  );
  const itemsLoading = !!itemsQuery.isFetching;

  const fmt = (n) => Number(n || 0).toLocaleString();

  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  useLayoutEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.getBoundingClientRect().width;
      setDropdownWidth(Math.max(w, MIN_DROPDOWN_WIDTH));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      if (/** @type {any} */ (el).contains(e.target)) return;
      close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen]);

  const statusText = row.statusText ?? '출고 완료';
  const dateText = row.outboundDate ?? row.orderDate ?? '-';

  return (
    <tr className="border-b last:border-0 hover:bg-muted/30 transition-colors">
      {/* 상태 */}
      <td className="py-3 text-center">
        <Badge variant="secondary" className="text-emerald-700 bg-emerald-100">
          {statusText}
        </Badge>
      </td>

      {/* 출고완료일 */}
      <td className="py-3 text-center text-sm text-muted-foreground">
        {formatDateWithDay(dateText)}
      </td>

      {/* 수주번호 */}
      <td className="py-3 text-center font-mono text-sm truncate">
        {row.orderNumber ?? '-'}
      </td>

      {/* 판매처 */}
      <td className="py-3 text-center">
        <div className="mx-auto max-w-[150px] truncate">
          {row.sellerVendorName ?? '-'}
        </div>
      </td>

      {/* 담당자 */}
      <td className="py-3 text-center">
        <div className="mx-auto max-w-[90px] truncate">
          {row.userName ?? row.userId ?? '-'}
        </div>
      </td>

      {/* 품목 수 */}
      <td className="py-3 text-center">
        <div ref={wrapRef} className="relative inline-block">
          <Button
            ref={btnRef}
            type="button"
            variant="secondary"
            size="sm"
            disabled={loading}
            className="gap-2"
            onClick={toggle}
          >
            <span className="font-medium">{Number(row.itemCount ?? 0)}개</span>
            <span className="text-muted-foreground">품목</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {isOpen && (
            <div className="absolute left-0 z-50 mt-2" style={{ width: dropdownWidth }}>
              {itemsLoading ? (
                <div className="w-full rounded-lg border bg-background p-3 text-sm text-muted-foreground shadow-lg">
                  품목 조회 중...
                </div>
              ) : (
                <OutboundCompletedItemsDropdown items={items} />
              )}
            </div>
          )}
        </div>
      </td>

      {/* 단가총액 */}
      <td className="py-3 text-right font-medium tabular-nums">
        {fmt(row.totalAmount)}원
      </td>
    </tr>
  );
}