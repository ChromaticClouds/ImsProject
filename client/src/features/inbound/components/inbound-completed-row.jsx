// @ts-check
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInboundCompletedItems } from '../hooks/use-inbound-completed-items';
import { InboundPendingItemsDropdown } from './inbound-pending-items-dropdown';

/**
 * @param {{
 *  row: any,
 *  loading: boolean,
 * }} props
 */
export function InboundCompletedRow({ row, loading }) {
  const [isOpen, setIsOpen] = useState(false);

  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(240);
  const MIN_DROPDOWN_WIDTH = 360;

  const itemsQuery = useInboundCompletedItems(row.orderNumber, isOpen);
  const items = Array.isArray(itemsQuery.data) ? itemsQuery.data : [];

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
      setIsOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen]);

  return (
    <tr>
      <td style={{ padding: 8 }}>{row.statusText ?? '입고 완료'}</td>
      <td style={{ padding: 8 }}>{row.orderDate ?? '-'}</td>
      <td style={{ padding: 8 }}>{row.orderNumber}</td>
      <td style={{ padding: 8 }}>{row.vendorName}</td>

      <td style={{ padding: 8 }}>
        <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button
            ref={btnRef}
            onClick={() => setIsOpen((v) => !v)}
            disabled={loading}
          >
            {row.itemCount}개 품목 {isOpen ? '▲' : '▼'}
          </button>

          {isOpen ? (
            <div style={{ position: 'absolute', zIndex: 50, marginTop: 8, width: dropdownWidth }}>
              {itemsQuery.isFetching ? (
                <div
                  style={{
                    width: '100%',
                    padding: 10,
                    border: '1px solid #ddd',
                    borderRadius: 10,
                    background: '#fff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    fontSize: 13,
                    color: '#666',
                  }}
                >
                  품목 조회 중...
                </div>
              ) : (
                <InboundPendingItemsDropdown items={items} />
              )}
            </div>
          ) : null}
        </div>
      </td>

      <td style={{ padding: 8, textAlign: 'right' }}>
        {Number(row.totalAmount || 0).toLocaleString()}
      </td>
    </tr>
  );
}
