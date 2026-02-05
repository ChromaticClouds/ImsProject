// @ts-check
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InboundPendingItemsDropdown } from './inbound-pending-items-dropdown';
import { useInboundItems } from '../hooks/use-inbound-items';

/**
 * @param {{
 *  row: any,
 *  loading?: boolean,
 *  onError?: (msg: string) => void,
 * }} props
 */
export function InboundOverviewPendingRow({ row, loading = false, onError }) {
  const nav = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  const itemsQ = useInboundItems(row.orderNumber, 'INBOUND_PENDING', isOpen);
  const items = Array.isArray(itemsQ.data) ? itemsQ.data : [];
  const itemsLoading = itemsQ.isFetching;

  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(240);
  const MIN_DROPDOWN_WIDTH = 360;

  function goRegister() {
    onError?.('');
    nav(`/dashboard/inbounds/register/${encodeURIComponent(row.orderNumber)}`, {
      state: { vendorName: row.vendorName },
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
      if (el.contains(e.target)) return;
      close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen]);

  return (
    <tr>
      <td>{row.statusText ?? '입고 대기'}</td>
      <td>{row.receiveDate ?? '-'}</td>
      <td>{row.orderNumber}</td>
      <td>{row.vendorName}</td>

      <td>
        <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button ref={btnRef} onClick={toggle} disabled={loading}>
            {row.itemCount}개 품목 {isOpen ? '▲' : '▼'}
          </button>

          {isOpen ? (
            <div style={{ position: 'absolute', zIndex: 50, marginTop: 8, width: dropdownWidth }}>
              {itemsLoading ? (
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

      <td style={{ textAlign: 'right' }}>{Number(row.totalAmount || 0).toLocaleString()}</td>

      <td>
        <button
          disabled={loading}
          onClick={() =>
            nav(`/dashboard/inbounds/pending/edit/${encodeURIComponent(row.orderNumber)}`)
          }
        >
          수정
        </button>
      </td>
      <td>
        <button disabled={loading} onClick={goRegister}>
          등록
        </button>
      </td>
    </tr>
  );
}
