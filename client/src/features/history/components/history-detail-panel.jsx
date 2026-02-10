// @ts-check
import { useMemo, useState } from 'react';
import { useHistoryLotDetail } from '../hooks/use-history-lot-detail.js';
import { toKoreanType } from '@/constants/index.js';
import { Button } from '@/components/ui/button.js';

function money(n) { return Number(n ?? 0).toLocaleString(); }
function num(n) { return Number(n ?? 0).toLocaleString(); }

export function HistoryDetailPanel({ lotId }) {
  const q = useHistoryLotDetail(lotId);
  const data = q.data;

  const items = Array.isArray(data?.items) ? data.items : [];

  const totals = useMemo(() => {
    const itemCount = items.length;
    const totalDelta = items.reduce((acc, it) => acc + Number(it.delta ?? 0), 0);
    return { itemCount, totalDelta };
  }, [items]);

  const [prodOpen, setProdOpen] = useState(false);
  const [prod, setProd] = useState(null);

  if (!lotId) {
    return <div style={{ padding: 16 }}>항목 선택 시 뜹니다.</div>;
  }

  if (q.isFetching) return <div style={{ padding: 16 }}>불러오는 중...</div>;
  if (!data) return <div style={{ padding: 16 }}>상세 없음</div>;

  const vendorText =
    data.status === 'INBOUND' ? data.vendorName :
    data.status === 'OUTBOUND' ? data.sellerVendorName : '';

  return (
    <div style={{ padding: 14, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>{data.statusText}</h3>
        <div style={{ fontSize: 12, color: '#666' }}>{data.userName ?? '-'}</div>
      </div>

      <div style={{ marginTop: 10, lineHeight: 1.8, fontSize: 13 }}>
        <div><b>등록일시</b> {data.createdAt ?? '-'}</div>
        <div><b>거래처</b> {vendorText || '-'}</div>
        
      </div>

      <div style={{
        marginTop: 10,
        border: '1px solid #eee',
        borderRadius: 10,
        padding: 12,
        background: '#fff'
      }}>
        {data.memo ? data.memo : <span style={{ color: '#888' }}>메모 없음</span>}
      </div>

      <div style={{ marginTop: 14, fontWeight: 800 }}>제품</div>

      <div style={{ marginTop: 8, borderTop: '1px solid #ddd' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px', gap: 10, padding: '10px 0', fontSize: 12, color: '#666' }}>
          <div>제품</div>
          <div style={{ textAlign: 'center' }}>변동 전/후</div>
          <div style={{ textAlign: 'right' }}>변동수량</div>
        </div>

        {items.map((it) => {
          const delta = Number(it.delta ?? 0);
          const deltaText =
            data.status === 'INBOUND' ? `+${Math.abs(delta)}` :
            data.status === 'OUTBOUND' ? `-${Math.abs(delta)}` :
            (delta >= 0 ? `+${delta}` : `${delta}`);

          return (
            <div key={it.historyId} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px', gap: 10, padding: '10px 0', borderTop: '1px solid #f0f0f0' }}>
              <div>
                <button
                  onClick={() => { setProd(it); setProdOpen(true); }}
                  style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontWeight: 800 }}
                >
                  {it.productName}
                </button>
                <div style={{ fontSize: 11, color: '#777' }}>
                  {toKoreanType(it.type)} / {it.brand ?? '-'}{it.volume ? ` / ${it.volume}` : ''}
                </div>
              </div>

              <div style={{ textAlign: 'center', fontWeight: 800 }}>
                {num(it.beforeCount)} → {num(it.afterCount)}
              </div>

              <div style={{ textAlign: 'right', fontWeight: 800, color: data.status === 'OUTBOUND' ? 'crimson' : data.status === 'INBOUND' ? '#1d4ed8' : '#16a34a' }}>
                {deltaText}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
        <div>총 {items.length}개 품목</div>
        <div>총 수량 {num(totals.totalDelta)}</div>
      </div>

      {prodOpen && prod ? (
        <div
          onMouseDown={(e) => { if (e.target === e.currentTarget) setProdOpen(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'grid', placeItems: 'center', zIndex: 50 }}
        >
          <div style={{ width: 420, maxWidth: '92vw', background: '#fff', borderRadius: 12, padding: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>제품 상세 정보</div>
            <div style={{ fontSize: 13, lineHeight: 1.9 }}>
              <div><b>제품코드</b> {prod.productCode ?? '-'}</div>
              <div><b>제품명</b> {prod.productName ?? '-'}</div>
              <div><b>주종</b> {toKoreanType(prod.type ?? '-')}</div>
              <div><b>브랜드</b> {prod.brand ?? '-'}</div>
              <div><b>구매단가</b> {prod.purchasePrice != null ? money(prod.purchasePrice) : '-'}</div>
              <div><b>판매단가</b> {prod.salePrice != null ? money(prod.salePrice) : '-'}</div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="button" variant="outline" onClick={() => setProdOpen(false)}>닫기</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
