// @ts-check
import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useInboundPendingItems } from '../hooks/use-inbound-pending-items';
import { useQueryClient } from '@tanstack/react-query';
import { completeInboundByOrderNumber } from '@/services/api';
import { Button } from '@/components/ui/button';


const MEMO_MAX = 300;

export function InboundRegisterPage() {
  const nav = useNavigate();
  const { orderNumber = '' } = useParams();
  const { state } = useLocation();
  const qc = useQueryClient();
  const vendorName = state?.vendorName ?? '-';
  const [receivedAt] = useState(() => new Date());
  const [memo, setMemo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 발주번호에 속한 품목 목록 조회
  const { data, isFetching } = useInboundPendingItems(orderNumber, true);
  const items = Array.isArray(data) ? data : [];

  // 총 품목 수 / 총 수량 계산
  const totals = useMemo(() => {
    const n = items.length;
    const m = items.reduce((acc, it) => acc + Number(it.orderQty ?? 0), 0);
    return { n, m };
  }, [items]);

  const memoOver = memo.length > MEMO_MAX;

  async function handleComplete() {
    setError('');

    if (memoOver) {
      setError('메모 입력 한도(300자)를 초과했습니다.');
      return;
    }

    const ok = window.confirm(
      `총 ${totals.n}종, ${totals.m}개의 제품을 입고 확정하시겠습니까?`
    );
    if (!ok) return;

    try {
      setSubmitting(true);

      await completeInboundByOrderNumber(orderNumber, {
        memo: memo || undefined,
        receivedAt: receivedAt.toISOString(),
      });

      await qc.invalidateQueries({ queryKey: ['inbound-pending-summary'] });
    nav('/dashboard/inbounds/pending');
    } catch (e) {
      setError(e?.message || '입고 완료 처리 실패');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2>입고 등록</h2>

      {/* 상단 정보 */}
      <div style={{ marginTop: 12, lineHeight: 1.8 }}>
        <div><b>공급처명:</b> {vendorName}</div>
        <div><b>입고 일자:</b> {receivedAt.toLocaleString()}</div>
      </div>

      <hr style={{ margin: '16px 0' }} />

      {/* 입고 목록 */}
      <h3>입고 목록</h3>

      {isFetching ? <div>품목 조회 중...</div> : null}

      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it) => (
          <div
            key={it.orderId}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr auto',
              gap: 12,
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 10,
              background: '#fff',
            }}
          >
            <img
              src={it.imageUrl || null}
              alt=""
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 8,
                background: '#f3f3f3',
              }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />

            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{it.productName}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: '#777' }}>
                {it.type ?? '-'} · {it.brand ?? '-'}
              </div>

              <div style={{ marginTop: 8, fontSize: 13 }}>
                구매 단가: <b>{Number(it.purchasePrice ?? 0).toLocaleString()}</b>
                {' · '}
                판매 단가: <b>{it.salePrice ? Number(it.salePrice).toLocaleString() : '-'}</b>
              </div>

              <div>
                안전재고: <b>-</b> / 현재고: <b>-</b>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div>입고 수량</div>
              <div>{it.orderQty ?? 0}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 합계 */}
      <div style={{ marginTop: 12, fontSize: 14 }}>
        <b>최종 품목 수:</b> {totals.n}종 &nbsp; / &nbsp;
        <b>총 입고 수량:</b> {totals.m}개
      </div>

      <hr style={{ margin: '16px 0' }} />

      {/* 메모 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <b>메모</b>
          <span style={{ fontSize: 12, color: memoOver ? 'crimson' : '#666' }}>
            {memo.length}/{MEMO_MAX}
          </span>
        </div>

        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={4}
          placeholder="메모를 입력하세요 (최대 300자)"
          style={{
            width: '100%',
            marginTop: 8,
            padding: 10,
            borderRadius: 8,
            border: '1px solid #ddd',
          }}
        />

        {memoOver ? (
          <div style={{ marginTop: 6, fontSize: 12, color: 'crimson' }}>
            입력 한도를 초과했습니다.
          </div>
        ) : null}
      </div>

      {error ? (
        <div style={{ marginTop: 10, color: 'crimson' }}>{error}</div>
      ) : null}

      {/* 버튼 */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={handleComplete} disabled={submitting || memoOver || isFetching}>
          {submitting ? '처리중...' : '입고 완료'}
        </button>
      </div>
    </div>
  );
}
