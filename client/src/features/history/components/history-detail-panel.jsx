
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
    return <div className="p-4 text-muted-foreground">항목 선택 시 뜹니다.</div>;
  }
  if (q.isFetching) return <div className="p-4 text-muted-foreground">불러오는 중...</div>;
  if (!data) return <div className="p-4 text-muted-foreground">상세 없음</div>;

  const vendorText =
    data.status === 'INBOUND' ? data.vendorName :
    data.status === 'OUTBOUND' ? data.sellerVendorName : '';

  return (
    <div className="p-3.5 h-full overflow-auto bg-background">
      {/* 헤더 */}
      <div className="flex justify-between">
        <h3 className="m-0 font-bold">{data.statusText}</h3>
        <div className="text-xs text-muted-foreground">{data.userName ?? '-'}</div>
      </div>

      {/* 기본 정보 */}
      <div className="mt-2.5 text-sm leading-7">
        <div><b>등록일시</b> {data.createdAt ?? '-'}</div>
        <div><b>거래처</b> {vendorText || '-'}</div>
      </div>

      {/* 메모: 여기만 bg-secondary */}
      <div className="mt-2.5 rounded-lg p-3 bg-secondary border border-border">
        {data.memo ? (
          <div className="text-sm whitespace-pre-wrap">{data.memo}</div>
        ) : (
          <span className="text-sm text-muted-foreground">메모 없음</span>
        )}
      </div>

      <div className="mt-3.5 font-extrabold">제품</div>

      {/* 테이블 */}
      <div className="mt-2 border-t border-border">
        <div className="grid grid-cols-[1fr_160px_120px] gap-2.5 py-2.5 text-xs text-muted-foreground">
          <div>제품</div>
          <div className="text-center">변동 전/후</div>
          <div className="text-right">변동수량</div>
        </div>

        {items.map((it) => {
          const delta = Number(it.delta ?? 0);
          const deltaText =
            data.status === 'INBOUND' ? `+${Math.abs(delta)}` :
            data.status === 'OUTBOUND' ? `-${Math.abs(delta)}` :
            (delta >= 0 ? `+${delta}` : `${delta}`);

          return (
            <div
              key={it.historyId}
              className="grid grid-cols-[1fr_160px_120px] gap-2.5 py-2.5 border-t border-border"
            >
              <div>
                <button
                  type="button"
                  onClick={() => { setProd(it); setProdOpen(true); }}
                  className="p-0 text-left font-extrabold hover:underline"
                >
                  {it.productName}
                </button>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {toKoreanType(it.type)} / {it.brand ?? '-'}{it.volume ? ` / ${it.volume}` : ''}
                </div>
              </div>

              <div className="text-center font-extrabold tabular-nums">
                {num(it.beforeCount)} → {num(it.afterCount)}
              </div>

              <div
                className={`text-right font-extrabold tabular-nums ${
                  data.status === 'OUTBOUND'
                    ? 'text-red-600 dark:text-red-400'
                    : data.status === 'INBOUND'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-green-600 dark:text-green-400'
                }`}
              >
                {deltaText}
              </div>
            </div>
          );
        })}
      </div>

      {/* 합계 */}
      <div className="mt-3 flex justify-between font-extrabold">
        <div>총 {items.length}개 품목</div>
        <div>총 수량 {num(totals.totalDelta)}</div>
      </div>

      {/* 모달 */}
      {prodOpen && prod ? (
        <div
          onMouseDown={(e) => { if (e.target === e.currentTarget) setProdOpen(false); }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/40"
        >
          <div className="w-[420px] max-w-[92vw] rounded-xl border border-border bg-secondary p-4">
            <div className="font-black mb-2">제품 상세 정보</div>

            <div className="text-sm leading-7">
              <div><b>제품코드</b> {prod.productCode ?? '-'}</div>
              <div><b>제품명</b> {prod.productName ?? '-'}</div>
              <div><b>주종</b> {toKoreanType(prod.type ?? '-')}</div>
              <div><b>브랜드</b> {prod.brand ?? '-'}</div>
              <div><b>구매단가</b> {prod.purchasePrice != null ? money(prod.purchasePrice) : '-'}</div>
              <div><b>판매단가</b> {prod.salePrice != null ? money(prod.salePrice) : '-'}</div>
            </div>

            <div className="mt-3 flex justify-end">
              <Button type="button" variant="outline" onClick={() => setProdOpen(false)}>
                닫기
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}