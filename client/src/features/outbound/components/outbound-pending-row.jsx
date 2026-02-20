// @ts-check
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';

import { useOutboundPendingItems } from '../hooks/use-outbound-pending-items.js';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.js';

// -----------------------------
// JWT helpers
// -----------------------------
function decodeJwtPayload(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length < 2) return null;
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getMyUserIdFromToken(token) {
  const p = decodeJwtPayload(token);
  if (!p) return null;

  if (p.id != null && !Number.isNaN(Number(p.id))) return Number(p.id);
  if (p.userId != null && !Number.isNaN(Number(p.userId))) return Number(p.userId);
  if (p.sub != null && !Number.isNaN(Number(p.sub))) return Number(p.sub);
  return null;
}

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

/**
 * 날짜 + 요일 표시 (예: 2026-02-18 (수))
 * @param {string | null | undefined} dateStr
 */
function formatDateWithDay(dateStr) {
  if (!dateStr || dateStr === '-') return '-';

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr; // 파싱 실패 시 원본 유지

  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const day = week[d.getDay()];

  // ISO / datetime 대응 (YYYY-MM-DD만 표시)
  const s = String(dateStr);
  const dateOnly = s.length >= 10 ? s.slice(0, 10) : s;

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
 * Dropdown (row 내부에서만 씀)
 * @param {{ items: any[] }} props
 */
function OutboundPendingItemsDropdown({ items }) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background shadow-lg">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 grid grid-cols-12 gap-2 border-b bg-muted/50 px-3 py-2 text-[11px] font-semibold text-muted-foreground">
        <div className="col-span-7">품목</div>
        <div className="col-span-5 text-right">수주수량 / 현재고</div>
      </div>

      <div className="max-h-[320px] overflow-auto">
        {list.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">품목 없음</div>
        ) : (
          <div className="divide-y">
            {list.map((it) => {
              const shortage = Number(it.shortage || 0) === 1;
              return (
                <div
                  key={it.orderId}
                  className={`grid grid-cols-12 items-center gap-2 px-3 py-2 text-sm hover:bg-muted/30 transition-colors ${
                    shortage ? 'bg-red-50/60' : ''
                  }`}
                >
                  {/* 품목 + 이미지 */}
                  <div className="col-span-7 min-w-0 flex items-center gap-3">
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

                  {/* 수주수량 / 현재고 */}
                  <div className="col-span-5 flex flex-col items-end gap-1 text-xs tabular-nums">
                    <div>
                      <span className="text-muted-foreground">수주수량 </span>
                      <span className="font-semibold text-foreground">
                        {Number(it.orderQty ?? 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">현재고 </span>
                      <span className={`font-semibold ${shortage ? 'text-red-700' : 'text-foreground'}`}>
                        {Number(it.stockCount ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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
 *  onError?: (m: string) => void,
 * }} props
 */
export function OutboundPendingRow({ row, loading, onError }) {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  const [dropdownWidth, setDropdownWidth] = useState(360);
  const MIN_DROPDOWN_WIDTH = 360;

  const accessToken = useAuthStore((s) => s.accessToken);
  const myId = useMemo(() => getMyUserIdFromToken(accessToken), [accessToken]);

  const managerId = row?.managerId == null ? null : Number(row.managerId);
  const isMine = myId != null && managerId != null && myId === managerId;

  const itemsQuery = useOutboundPendingItems(row.orderNumber, isOpen);
  const items = useMemo(
    () => (Array.isArray(itemsQuery.data) ? itemsQuery.data : []),
    [itemsQuery.data]
  );

  const shortage =
    Number(row?.hasShortage || 0) === 1 || items.some((it) => Number(it.shortage || 0) === 1);

  const fmt = (n) => Number(n || 0).toLocaleString();

  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  function goRegister() {
    onError?.('');
    nav(`/dashboard/outbounds/register/${encodeURIComponent(row.orderNumber)}`, {
      state: { sellerVendorName: row.sellerVendorName ?? '-' },
    });
  }

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

  const statusText = row.statusText ?? '출고 대기';

  return (
    <tr
      className={`border-b last:border-0 transition-colors ${
        shortage ? 'bg-red-50/60 hover:bg-red-50' : 'hover:bg-muted/30'
      }`}
    >
      {/* 상태 */}
      <td className="py-3 text-center">
        <Badge
          variant="secondary"
          className={shortage ? 'bg-red-100 text-red-700' : 'text-amber-700'}
        >
          {statusText}
        </Badge>
      </td>

      {/* 납기희망일 */}
      <td className="py-3 text-center text-sm text-muted-foreground">
        {formatDateWithDay(row.receiveDate)}
      </td>

      {/* 수주번호 */}
      <td className="py-3 text-center font-mono text-sm">
        {row.orderNumber ?? '-'}
      </td>

      {/* 판매처 */}
      <td className="py-3 text-center">
        <div className="mx-auto max-w-[220px] truncate">
          {row.sellerVendorName ?? '-'}
        </div>
      </td>

      {/* 담당자 */}
      <td className="py-3 text-center">
        <div className="inline-flex items-center gap-2">
          <span className="truncate">{row.managerName ?? '-'}</span>
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
              {itemsQuery.isFetching ? (
                <div className="w-full rounded-lg border bg-background p-3 text-sm text-muted-foreground shadow-lg">
                  품목 조회 중...
                </div>
              ) : (
                <OutboundPendingItemsDropdown items={items} />
              )}
            </div>
          )}
        </div>
      </td>

      {/* 단가총액 */}
      <td className="py-3 text-right font-medium tabular-nums">
        {fmt(row.totalAmount)}원
      </td>

      {/* 등록 */}
      <td className="py-3 text-center">
        <Button
          size="sm"
          className="gap-2"
          onClick={goRegister}
          disabled={loading || shortage || !isMine}
          variant={shortage || !isMine ? 'secondary' : 'default'}
          title={
            shortage
              ? '재고 부족으로 등록할 수 없습니다.'
              : !isMine
                ? '내 담당 건만 등록할 수 있습니다.'
                : ''
          }
        >
          <PlusCircle className="h-4 w-4" />
          등록
        </Button>
      </td>
    </tr>
  );
}
