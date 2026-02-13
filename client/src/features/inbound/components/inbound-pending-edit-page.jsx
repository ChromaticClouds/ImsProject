// @ts-check
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useInboundPendingDetail } from '../hooks/use-inbound-pending-detail';
import { useUpdateInboundPending } from '../hooks/use-update-inbound-pending';
import { inboundQueryKeys } from '../hooks/inboundQueryKeys';

export function InboundPendingEditPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { orderNumber = '' } = useParams();

  const { data, isFetching } = useInboundPendingDetail(orderNumber);
  const { mutateAsync, isPending } = useUpdateInboundPending(orderNumber);

  const items = useMemo(() => (Array.isArray(data?.items) ? data.items : []), [data]);

  const [receiveDate, setReceiveDate] = useState('');
  const [qtyMap, setQtyMap] = useState(() => ({}));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!data) return;
    if (!receiveDate) setReceiveDate(String(data.receiveDate ?? ''));
    if (Object.keys(qtyMap).length === 0 && items.length) {
      const next = {};
      for (const it of items) next[it.orderId] = String(it.orderQty ?? '');
      setQtyMap(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, items]);

  const { isValid, totalKinds, totalQty } = useMemo(() => {
    if (!items.length) return { isValid: false, totalKinds: 0, totalQty: 0 };
    let sum = 0;
    for (const it of items) {
      const raw = qtyMap[it.orderId];
      const n = Number(raw);
      if (!raw || !Number.isFinite(n) || n <= 0) return { isValid: false, totalKinds: items.length, totalQty: 0 };
      sum += n;
    }
    return { isValid: true, totalKinds: items.length, totalQty: sum };
  }, [items, qtyMap]);

  async function save() {
    setError('');
    try {
      const payload = {
        receiveDate: receiveDate || null,
        items: items.map((it) => ({
          orderId: it.orderId,
          orderQty: Number(qtyMap[it.orderId]),
        })),
      };

      await mutateAsync(payload);

        
        await qc.invalidateQueries({ queryKey: inboundQueryKeys.pendingItems(orderNumber), exact: true });
        await qc.invalidateQueries({ queryKey: inboundQueryKeys.pendingDetail(orderNumber), exact: true });
        await qc.invalidateQueries({ queryKey: ['inbound-pending-summary'], exact: false });
        await qc.refetchQueries({ queryKey: ['inbound-pending-summary'], exact: false });

        nav('/dashboard/inbounds/pending');
    } catch (e) {
      setError(e?.message || '수정 실패');
    }
  }

  const saveDisabled = isFetching || isPending || !isValid;

  return (
    <div style={{ padding: 16 }}>
      <h2>입고 대기 수정</h2>

      {error ? <div style={{ color: 'red', marginBottom: 12 }}>{error}</div> : null}

      <div style={{ marginBottom: 12, fontSize: 14 }}>
        <div><b>발주번호</b>: {orderNumber}</div>
        <div><b>공급처</b>: {data?.vendorName ?? '-'}</div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 6 }}>입고 예정일</div>
        <input
          type="date"
          value={receiveDate}
          onChange={(e) => setReceiveDate(e.target.value)}
          disabled={isFetching || isPending}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>
          품목 목록 ({totalKinds}종 / 총 {totalQty}개)
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>제품명</th>
              <th style={{ textAlign: 'left', padding: 8 }}>브랜드/주종</th>
              <th style={{ textAlign: 'right', padding: 8 }}>구매단가</th>
              <th style={{ textAlign: 'right', padding: 8 }}>발주수량</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const raw = qtyMap[it.orderId];
              const n = Number(raw);
              const bad = !raw || !Number.isFinite(n) || n <= 0;

              return (
                <tr key={it.orderId}>
                  <td style={{ padding: 8 }}>{it.productName}</td>
                  <td style={{ padding: 8, color: '#666', fontSize: 12 }}>
                    {it.brand ?? '-'} / {it.type ?? '-'}
                  </td>
                  <td style={{ padding: 8, textAlign: 'right' }}>
                    {Number(it.purchasePrice ?? 0).toLocaleString()}
                  </td>
                  <td style={{ padding: 8, textAlign: 'right' }}>
                    <input
                      type="number"
                      min={1}
                      value={raw ?? ''}
                      onChange={(e) => setQtyMap((prev) => ({ ...prev, [it.orderId]: e.target.value }))}
                      style={{
                        width: 90,
                        textAlign: 'right',
                        border: bad ? '1px solid red' : '1px solid #ccc',
                        borderRadius: 6,
                        padding: '4px 6px',
                      }}
                      disabled={isFetching || isPending}
                    />
                  </td>
                </tr>
              );
            })}
            {!items.length ? (
              <tr>
                <td colSpan={4} style={{ padding: 12, textAlign: 'center', color: '#666' }}>
                  품목이 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        {!isValid && items.length ? (
          <div style={{ marginTop: 8, color: 'red', fontSize: 12 }}>
            수량은 모두 1 이상으로 입력해야 저장할 수 있습니다.
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button onClick={() => nav(-1)} disabled={isPending}>취소</button>
        <button onClick={save} disabled={saveDisabled}>
          {isPending ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
