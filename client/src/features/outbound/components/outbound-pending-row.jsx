// @ts-check
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutboundPendingItems } from '../hooks/use-outbound-pending-items.js';

/**
 * @param {{ items: any[] }} props
 */
function OutboundPendingItemsDropdown({ items }) {
  return (
    <div
      style={{
        width: '100%',
        maxHeight: 320,
        overflow: 'auto',
        border: '1px solid #ddd',
        borderRadius: 10,
        background: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        padding: 8,
      }}
    >
      
      <div>
          {items.map((it) => {
            const shortage = Number(it.shortage || 0) === 1;
            return (
              <div
              key={it.orderId} 
              style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 10px',
                borderRadius: 8,
                background: shortage ? '#f7f7f7' : 'transparent'
             }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f7f7f7')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ minWidth: 0 }}>
                <div 
                style={{ 
                  fontWeight: 700,
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                 }}
                 title={it.productName}
                 >{it.productName}
                 </div>
                <div>
                  {(it.type ?? '-')}{' · '}{(it.brand ?? '-')}
                </div>
                </div>
                <div 
                style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span>수주수량{Number(it.orderQty ?? 0)}</span>
                  <span>현재고{Number(it.stockCount ?? 0)}</span>
                </div>
              </div>
            );
          })}

          {!items.length ? (
            <tr>
              <td colSpan={4} style={{ padding: 10, textAlign: 'center', color: '#666' }}>
                품목 없음
              </td>
            </tr>
          ) : null}
      </div>
    </div>
  );
}

/**
 * @param {{
 *  row: any,
 *  loading: boolean,
 *  onError: (m: string) => void,
 * }} props
 */
export function OutboundPendingRow({ row, loading, onError }) {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(240);
  const MIN_DROPDOWN_WIDTH = 360;

  const itemsQuery = useOutboundPendingItems(row.orderNumber, isOpen);
  const items = useMemo(() => (Array.isArray(itemsQuery.data) ? itemsQuery.data : []), [itemsQuery.data]);


  const shortage =
    Number(row.hasShortage || 0) === 1 ||
    items.some((it) => Number(it.shortage || 0) === 1);

  const isOverdue = String(row.statusText || '') === '미납';

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
    <tr style={{ background: shortage ? '#ffecec' : 'transparent' }}>
      <td style={{ padding: 8 }}>{row.statusText ?? '출고 대기'}</td>
      <td style={{ padding: 8 }}>{row.receiveDate ?? '-'}</td>
      <td style={{ padding: 8 }}>{row.orderNumber}</td>
      <td style={{ padding: 8 }}>{row.sellerVendorName ?? '-'}</td>

      <td style={{ padding: 8 }}>
        <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button
            ref={btnRef}
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            disabled={loading}
          >
            {row.itemCount ?? 0}개 품목 {isOpen ? '▲' : '▼'}
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
                <OutboundPendingItemsDropdown items={items} />
              )}
            </div>
          ) : null}
        </div>
      </td>

      <td style={{ padding: 8, textAlign: 'right' }}>
        {Number(row.totalAmount ?? 0).toLocaleString()}
      </td>

      <td style={{ padding: 8 }}>{row.userName ?? '-'}</td>

      <td style={{ padding: 8, textAlign: 'right' }}>
        <button
          type="button"
          disabled={loading || shortage}
          onClick={() => nav(`/dashboard/outbounds/register/${row.orderNumber}`, {
          state: { sellerVendorName: row.sellerVendorName ?? '-' }
          })}
        >
          등록
        </button>
      </td>
    </tr>
  );
}
