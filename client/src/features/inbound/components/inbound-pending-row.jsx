// @ts-check
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Pencil, PlusCircle } from 'lucide-react';

import { useInboundPendingRow } from '../hooks/use-inbound-pending-row';
import { InboundPendingItemsDropdown } from './inbound-pending-items-dropdown';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * @typedef {Object} InboundRow
 * @property {string} orderNumber
 * @property {string} vendorName
 * @property {string} statusText
 * @property {string} receiveDate
 * @property {number} itemCount
 * @property {number} totalAmount
 * @property {string} [status]
 */

/**
 * @typedef {Object} Props
 * @property {InboundRow} row
 * @property {boolean} [loading]
 * @property {(msg:string)=>void} [onError]
 */

/** @param {Props} props */
export function InboundPendingRow(props) {
  const { row, loading = false, onError } = props;

  const nav = useNavigate();
  const { isOpen, toggle, close, items, itemsLoading } =
    useInboundPendingRow(row.orderNumber);

  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(360);
  const MIN_DROPDOWN_WIDTH = 360;

  const fmt = (n) => Number(n || 0).toLocaleString();

  /**
   * 납기일 + 요일 표시 (예: 2026-02-18 (수))
   * @param {string | undefined | null} dateStr
   */
  const formatReceiveDate = (dateStr) => {
    if (!dateStr) return '-';

    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr; // 파싱 실패 시 원본 표시

    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const day = week[d.getDay()];

    // 날짜 부분만 잘라서 표시 (ISO 대응)
    const dateOnly = dateStr.length >= 10 ? dateStr.slice(0, 10) : dateStr;

    return `${dateOnly} (${day})`;
  };

  function goRegister() {
    onError?.('');
    nav(
      `/dashboard/inbounds/register/${encodeURIComponent(row.orderNumber)}`,
      { state: { vendorName: row.vendorName } }
    );
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
      if (el.contains(e.target)) return;
      close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen, close]);

  const statusText = row.statusText ?? '입고 대기';

  return (
    <tr className="border-b last:border-0 hover:bg-accent/30 transition-colors">
      <td className="py-3 text-center">
        <Badge variant="secondary" className="text-amber-700">
          {statusText}
        </Badge>
      </td>

      {/* ⭐ 여기만 변경됨: 요일 표시 */}
      <td className="py-3 text-center text-sm text-muted-foreground">
        {formatReceiveDate(row.receiveDate)}
      </td>

      <td className="py-3 text-center font-mono text-sm">
        {row.orderNumber}
      </td>

      <td className="py-3 text-center">
        <div className="mx-auto max-w-[220px] truncate">
          {row.vendorName ?? '-'}
        </div>
      </td>

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
            <span className="font-medium">
              {Number(row.itemCount ?? 0)}개
            </span>
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
                  <InboundPendingItemsDropdown items={items} qtyLabel="발주수량" />
                </div>
              )}
            </div>
          )}
        </div>
      </td>

      <td className="py-3 text-right font-medium">
        {fmt(row.totalAmount)}원
      </td>

      <td className="py-3 text-center">
        <Button size="sm" disabled={loading} className="gap-2" onClick={goRegister}>
          <PlusCircle className="h-4 w-4" />
          등록
        </Button>
      </td>
    </tr>
  );
}
