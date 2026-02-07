// @ts-check
import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useOutboundPendingItems } from '../hooks/use-outbound-pending-items.js';
import { useCompleteOutbound } from '../hooks/use-complete-outbound.js';

const MEMO_MAX = 300;

export function OutboundRegisterPage() {
  const nav = useNavigate();
  const { orderNumber = '' } = useParams();
  const { state } = useLocation();

  const sellerVendorName = state?.sellerVendorName ?? '-';

  const [shippedAt] = useState(() => new Date());
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');

  const { data, isFetching } = useOutboundPendingItems(orderNumber, true);
  const items = Array.isArray(data) ? data : [];

  const totals = useMemo(() => {
    const n = items.length;
    const m = items.reduce((acc, it) => acc + Number(it.orderQty ?? 0), 0);
    return { n, m };
  }, [items]);

  const memoOver = memo.length > MEMO_MAX;
  const hasShortage = items.some((it) => Number(it.shortage || 0) === 1);

  const { mutateAsync, isPending } = useCompleteOutbound();

  async function handleComplete() {
    setError('');

    if (!orderNumber) {
      setError('수주번호가 없습니다.');
      return;
    }
    if (memoOver) {
      setError('메모 입력 한도(300자)를 초과했습니다.');
      return;
    }
    if (!items.length) {
      setError('해당 수주번호에 품목이 없습니다.');
      return;
    }
    if (hasShortage) {
      setError('재고 부족 품목이 있어 출고 처리할 수 없습니다.');
      return;
    }

    const ok = window.confirm(`총 ${totals.n}종, ${totals.m}개의 제품을 출고 확정하시겠습니까?`);
    if (!ok) return;

    try {
      await mutateAsync({ orderNumber, memo });
    } catch (e) {
      setError(/** @type {any} */ (e)?.message || '출고 완료 처리 실패');
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2>출고 등록</h2>

      <div style={{ marginTop: 12, lineHeight: 1.8 }}>
        <div><b>판매처명:</b> {sellerVendorName}</div>
        <div><b>출고 일자:</b> {shippedAt.toLocaleString()}</div>
        <div><b>수주번호:</b> {orderNumber}</div>
      </div>

      <hr style={{ margin: '16px 0' }} />

      <h3>출고 목록</h3>
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
            {/* outbound는 이미지_url이 없을 수도 있으니 안전하게 */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                background: '#f3f3f3',
              }}
            />

            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{it.productName}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: '#777' }}>
                {it.type ?? '-'} · {it.brand ?? '-'}
              </div>

              <div style={{ marginTop: 8, fontSize: 13 }}>
                판매 단가: <b>{Number(it.salePrice ?? 0).toLocaleString()}</b>
                {' · '}
                현재고: <b>{Number(it.stockCount ?? 0).toLocaleString()}</b>
              </div>

              {Number(it.shortage || 0) === 1 ? (
                <div style={{ marginTop: 6, fontSize: 12, color: 'crimson' }}>
                  재고 부족 (출고 불가)
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div>출고 수량</div>
              <div><b>{it.orderQty ?? 0}</b></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        <b>최종 품목 수:</b> {totals.n}종 &nbsp; / &nbsp;
        <b>총 출고 수량:</b> {totals.m}개
      </div>

      <hr style={{ margin: '16px 0' }} />

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

      {error ? <div style={{ marginTop: 10, color: 'crimson' }}>{error}</div> : null}

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>

        <button
          onClick={handleComplete}
          disabled={isPending || memoOver || isFetching || hasShortage}
        >
          {isPending ? '처리중...' : '출고 완료'}
        </button>
      </div>
    </div>
  );
}
