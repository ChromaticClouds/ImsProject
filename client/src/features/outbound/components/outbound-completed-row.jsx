// @ts-check
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useOutboundCompletedItems } from '../hooks/use-outbound-completed-items';

/**
 * 
 * @param {{ items: any[] }} props
 */
function OutboundCompletedItemsDropdown({ items }) {
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
          {items.map((it) => (
            <div 
            key={it.orderId}
            style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 10px',
                borderRadius: 8,
                background: 'transparent'
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
              >{it.productName}</div>
              <div>
                {it.type ?? '-'} / {it.brand ?? '-'}
              </div>
              </div>
              <div 
              style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                출고수량{Number(it.orderQty ?? it.outboundQty ?? 0)}
              </div>
            </div>
          ))}

          {!items.length ? (
            <tr>
              <td colSpan={3} style={{ padding: 10, textAlign: 'center', color: '#666' }}>
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
 * }} props
 */
export function OutboundCompletedRow({ row, loading }) {
  const [isOpen, setIsOpen] = useState(false);

  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(240);
  const MIN_DROPDOWN_WIDTH = 360;

  const itemsQuery = useOutboundCompletedItems(row.orderNumber, isOpen);
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
      <td style={{ padding: 8 }}>{row.statusText ?? '출고 완료'}</td>
      <td style={{ padding: 8 }}>{row.outboundDate ?? row.orderDate ?? '-'}</td>
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
                <OutboundCompletedItemsDropdown items={items} />
              )}
            </div>
          ) : null}
        </div>
      </td>

      <td style={{ padding: 8, textAlign: 'right' }}>
        {Number(row.totalAmount || 0).toLocaleString()}
      </td>

      <td style={{ padding: 8 }}>{row.userName ?? row.userId ?? '-'}</td>
    </tr>
  );
}

