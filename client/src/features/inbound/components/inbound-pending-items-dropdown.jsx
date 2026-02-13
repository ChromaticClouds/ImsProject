// @ts-check
import React from 'react';
import { Button } from '@/components/ui/button';
/** @param {{ items: import('../types').InboundPendingItem[] }} props */
export function InboundPendingItemsDropdown({ items }) {
  const list = Array.isArray(items) ? items : [];

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
      {list.length === 0 ? (
        <div style={{ padding: 10, fontSize: 13, color: '#666' }}>품목이 없습니다.</div>
      ) : (
        list.map((i) => (
          <div
            key={i.orderId}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              padding: '10px 10px',
              borderRadius: 8,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f7f7f7')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {/* 제품명, 주종/브랜드 */}
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={i.productName}
              >
                {i.productName}
              </div>

              <div>
                {(i.type ?? '-')}{' · '}{(i.brand ?? '-')}
              </div>
            </div>

            {/* 안전재고/발주수량 */}
            <div>
              <StatChip label="안전재고" value={/** @type {any} */ (i).safetyStock ?? '-'} />
              <StatChip label="발주수량" value={i.orderQty ?? 0} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/** @param {{ label: string, value: any }} props */
function StatChip({ label, value }) {
  return (
    <div
      
    >
      <span>{label}</span>
      <span>{String(value)}</span>
    </div>
  );
}
