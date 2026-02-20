// @ts-check
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { useInboundCompletedItems } from '../hooks/use-inbound-completed-items';
import { InboundPendingItemsDropdown } from './inbound-pending-items-dropdown';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * @typedef {Object} InboundRow
 * @property {string} orderNumber
 * @property {string} vendorName
 * @property {string} statusText
 * @property {string} orderDate
 * @property {number} itemCount
 * @property {number} totalAmount
 * @property {number} [qtyChanged]
 * @property {string} [status]
 */

/**
 * @typedef {Object} Props
 * @property {InboundRow} row
 * @property {boolean} [loading]
 */

/** @param {Props} props */
export function InboundCompletedRow(props) {
  const { row, loading = false } = props;

  const [isOpen, setIsOpen] = useState(false);

  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  const [dropdownWidth, setDropdownWidth] = useState(360);
  const MIN_DROPDOWN_WIDTH = 360;

  const itemsQuery = useInboundCompletedItems(row.orderNumber, isOpen);
  const items = Array.isArray(itemsQuery.data) ? itemsQuery.data : [];
  const itemsLoading = !!itemsQuery.isFetching;

  const fmt = (n) => Number(n || 0).toLocaleString();

  /**
   * 날짜 + 요일 표시 (예: 2026-02-18 (수))
   * @param {string | null | undefined} dateStr
   */
  function formatDateWithDay(dateStr) {
    if (!dateStr) return '-';

    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;

    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const day = week[d.getDay()];
    const dateOnly = dateStr.length >= 10 ? dateStr.slice(0, 10) : dateStr;

    return `${dateOnly} (${day})`;
  }

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
    /** @param {MouseEvent} e */
    const onDown = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      if (/** @type {any} */ (el).contains(e.target)) return;
      close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen]);

  const statusText = row.statusText ?? '입고 완료';
  const isChanged = Number(row.qtyChanged ?? 0) === 1; // 

  return (
    <tr className="border-b last:border-0 hover:bg-muted/30 transition-colors">
      {/* 상태 */}
      <td className="py-3 text-center">
        <Badge variant="secondary" className="text-yellow-700 bg-amber-200">
          {statusText}
        </Badge>
      </td>

      {/* 발주일 */}
      <td className="py-3 text-center text-sm text-muted-foreground">
        {formatDateWithDay(row.orderDate)}
      </td>

      {/* 발주번호 */}
      <td className="py-3 text-center font-mono text-sm">
        {row.orderNumber ?? '-'}
      </td>

      {/* 거래처 */}
      <td className="py-3 text-center">
        <div className="mx-auto max-w-[220px] truncate">
          {row.vendorName ?? '-'}
        </div>
      </td>

      {/* 품목수 */}
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
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {isOpen && (
            <div
              className="absolute left-0 z-50 mt-2"
              style={{ width: dropdownWidth }}
            >
              {itemsLoading ? (
                <div className="w-full rounded-lg border bg-background p-3 text-sm text-muted-foreground shadow-lg">
                  품목 조회 중...
                </div>
              ) : (
                <div className="rounded-lg border bg-background shadow-lg">
                
                  <InboundPendingItemsDropdown items={items} qtyLabel="입고수량" />
                </div>
              )}
            </div>
          )}
        </div>
      </td>

      {/* 단가총액 */}
      <td className="py-3 text-right font-medium">
        {fmt(row.totalAmount)}원
      </td>

      {/* 변경됨 배지 */}
      <td className="py-3 text-center">
        {isChanged ? (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
            변경됨
          </Badge>
        ) : null}
      </td>
    </tr>
  );
}