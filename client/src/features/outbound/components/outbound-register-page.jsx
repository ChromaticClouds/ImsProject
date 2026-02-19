// @ts-check
import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useOutboundPendingItems } from '../hooks/use-outbound-pending-items.js';
import { useCompleteOutbound } from '../hooks/use-complete-outbound.js';

import { Button } from '@/components/ui/button.js';
import { Textarea } from '@/components/ui/textarea.js';
import { Badge } from '@/components/ui/badge.js';

const MEMO_MAX = 300;
const toMoney = (n) => Number(n || 0).toLocaleString();

/** 날짜 + 요일 + 시간 (예: 2026-02-18 (수) 13:05) */
function formatKoreanDateTime(d) {
  if (!d) return '-';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '-';

  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  const day = week[dt.getDay()];
  const hh = String(dt.getHours()).padStart(2, '0');
  const mi = String(dt.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} (${day}) ${hh}:${mi}`;
}


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
      return type ?? '-';
  }
}

/** 썸네일 (출고 items에 imageUrl 없을 수도 있으니 안전하게) */
function Thumb({ src, alt }) {
  const safeSrc = typeof src === 'string' ? src.trim() : '';
  return (
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
      {safeSrc ? (
        <img
          src={safeSrc}
          alt={alt ?? ''}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : null}
    </div>
  );
}

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
    const amount = items.reduce(
      (acc, it) => acc + Number(it.orderQty ?? 0) * Number(it.salePrice ?? 0),
      0
    );
    return { n, m, amount };
  }, [items]);

  const memoOver = memo.length > MEMO_MAX;
  const hasShortage = items.some((it) => Number(it.shortage || 0) === 1);

  const { mutateAsync, isPending } = useCompleteOutbound();

  async function handleComplete() {
    setError('');

    if (!orderNumber) return setError('수주번호가 없습니다.');
    if (memoOver) return setError('메모 입력 한도(300자)를 초과했습니다.');
    if (!items.length) return setError('해당 수주번호에 품목이 없습니다.');
    if (hasShortage) return setError('재고 부족 품목이 있어 출고 처리할 수 없습니다.');

    const ok = window.confirm(`총 ${totals.n}종, ${totals.m}개의 제품을 출고 확정하시겠습니까?`);
    if (!ok) return;

    try {
      await mutateAsync({ orderNumber, memo });
      nav('/dashboard/outbounds/pending'); // 필요하면 너 라우트에 맞게 수정
    } catch (e) {
      setError(/** @type {any} */ (e)?.message || '출고 완료 처리 실패');
    }
  }

  const submitDisabled = isPending || memoOver || isFetching || hasShortage || !orderNumber || !items.length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/40">
      <div className="mx-auto max-w-[1200px] px-5 py-6">
        {/* 상단 헤더 */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">출고 등록</h1>
              <Badge variant="secondary">OUTBOUND</Badge>
              {isFetching ? <Badge>조회중</Badge> : null}
              {hasShortage ? (
                <Badge className="bg-red-500 text-white">재고 부족</Badge>
              ) : null}
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">판매처</span> {sellerVendorName}
              <span className="mx-2">·</span>
              <span className="font-medium text-foreground">출고 일자</span> {formatKoreanDateTime(shippedAt)}
            </div>
          </div>

          <div className="text-xs text-muted-foreground font-mono">
            {orderNumber || '-'}
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {/* 전체 높이 고정 그리드 */}
        <div className="grid grid-cols-12 gap-4 lg:min-h-[calc(100vh-64px-140px)]">
          {/* 좌측: 출고 품목 */}
          <div className="col-span-12 lg:col-span-8 lg:flex">
            <div className="flex w-full flex-col rounded-2xl border bg-white">
              {/* 헤더 */}
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="text-lg font-semibold">출고 품목</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {orderNumber}
                </div>
              </div>

              {/* 컬럼 라벨 */}
              <div className="grid grid-cols-12 px-5 py-2 text-xs font-semibold text-muted-foreground border-b bg-muted/30">
                <div className="col-span-7">품목</div>
                <div className="col-span-3 text-right">판매 단가 / 현재고</div>
                <div className="col-span-2 text-right">출고수량</div>
              </div>

              {/* 리스트 (스크롤 영역 + 높이 채움) */}
              <div className="divide-y lg:flex-1 lg:overflow-auto">
                {items.length ? (
                  items.map((it) => {
                    const shortage = Number(it.shortage || 0) === 1;
                    return (
                      <div
                        key={it.orderId}
                        className={`grid grid-cols-12 items-center px-5 py-4 transition ${
                          shortage ? 'bg-red-50/60 hover:bg-red-50' : 'hover:bg-muted/20'
                        }`}
                      >
                        {/* 품목 */}
                        <div className="col-span-7 flex items-center gap-3 min-w-0">
                          <Thumb src={it.imageUrl} alt={it.productName} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="truncate font-semibold">
                                {it.productName ?? '-'}
                              </div>
                              {shortage ? (
                                <Badge className="bg-red-100 text-red-700">부족</Badge>
                              ) : null}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {toKoreanType(it.type)} · {it.brand ?? '-'}
                            </div>
                          </div>
                        </div>

                        {/* 판매 단가 / 현재고 */}
                        <div className="col-span-3 text-right">
                          <div className="text-sm font-semibold tabular-nums">
                            판매 {toMoney(it.salePrice)}원
                          </div>
                          <div className="text-xs text-muted-foreground tabular-nums">
                            현재고 {toMoney(it.stockCount)}개
                          </div>
                        </div>

                        {/* 출고수량 */}
                        <div className="col-span-2 text-right">
                          <div className="text-base font-bold tabular-nums">
                            {toMoney(it.orderQty)}개
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-20 text-center text-sm text-muted-foreground">
                    {isFetching ? '품목 조회 중...' : '품목이 없습니다.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 우측 요약 (sticky) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-5 space-y-4">
              <div className="rounded-2xl border bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-lg font-semibold">요약</div>
                  <Badge variant="secondary">확정 전</Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">판매처</div>
                    <div className="font-medium">{sellerVendorName}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">출고 일자</div>
                    <div className="font-medium">{formatKoreanDateTime(shippedAt)}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">품목 / 총 수량</div>
                    <div className="font-medium">
                      {totals.n}종 · {totals.m}개
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">총 금액</div>
                    <div className="text-xl font-bold tabular-nums">
                      {toMoney(totals.amount)}원
                    </div>
                  </div>

                  {hasShortage ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      재고 부족 품목이 있어 출고 완료할 수 없습니다.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-semibold">메모</div>
                  <div className={`text-xs ${memoOver ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {memo.length}/{MEMO_MAX}
                  </div>
                </div>

                <Textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={5}
                  placeholder="메모를 입력하세요 (최대 300자)"
                />
              </div>

              <div className="rounded-2xl border bg-white p-5">
                <Button
                  onClick={handleComplete}
                  disabled={submitDisabled}
                  className="w-full text-base h-11"
                >
                  {isPending ? '처리중...' : '출고 완료'}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => nav(-1)}
                  disabled={isPending}
                  className="w-full mt-2"
                >
                  뒤로
                </Button>

                {memoOver ? (
                  <div className="mt-2 text-xs text-destructive">
                    메모 입력 한도를 초과했습니다.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
