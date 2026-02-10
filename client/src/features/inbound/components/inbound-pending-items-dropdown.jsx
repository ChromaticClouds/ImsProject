// @ts-check
import React, { useMemo } from 'react';
import { useInboundSafetyStocks } from '../hooks/use-inbound-safety-stocks.js';

/** @param {{ items: import('../types').InboundPendingItem[] }} props */
export function InboundPendingItemsDropdown({ items }) {
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
      return type;
  }
}

  const safeQ = useInboundSafetyStocks({ productIds, enabled: productIds.length > 0 });
  const safeMap = safeQ.data && typeof safeQ.data === 'object' ? safeQ.data : {};

  const merged = useMemo(() => {
    return list.map((it) => {
      const pid = Number(it.productId);
      const row = safeMap?.[String(pid)];
      return {
        ...it,
        safetyStock: row?.safetyStock,
      };
    });
  }, [list, safeMap]);


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
      {merged.length === 0 ? (
        <div style={{ padding: 10, fontSize: 13, color: '#666' }}>품목이 없습니다.</div>
      ) : (
        merged.map((i) => (
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

                {toKoreanType(i.type) ?? '-' }{' · '}{(i.brand ?? '-')}
              </div>
            </div>

            {/* 안전재고/발주수량 */}
            <div style={{ display: 'grid', gap: 6, textAlign: 'right' }}>
              <StatChip
                label="안전재고"
                value={safeQ.isFetching ? '불러오는 중...' : (i.safetyStock ?? '-')}
              />
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
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <span style={{ fontSize: 12, color: '#666' }}>{label}</span>
      <span style={{ fontWeight: 800 }}>{String(value)}</span>
    </div>
  );
}
