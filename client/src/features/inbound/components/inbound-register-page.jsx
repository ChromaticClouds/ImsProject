// @ts-check
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useInboundPendingItems } from '../hooks/use-inbound-pending-items';
import { useInboundSafetyStocks } from '../hooks/use-inbound-safety-stocks.js';
import { completeInboundByOrderNumber } from '../api/index';

import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Textarea } from '@/components/ui/textarea.js';
import { Badge } from '@/components/ui/badge.js';
import { toast } from 'sonner';
import { IbRegisterDialog } from './ib-register-dialog.jsx';

const MEMO_MAX = 300;

const toMoney = (n) => Number(n || 0).toLocaleString();

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

const isValidQty = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0;
};

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

/** 썸네일 */
function Thumb({ src, alt }) {
  const safeSrc = typeof src === 'string' ? src.trim() : '';
  return (
    <div className='h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted'>
      {safeSrc ? (
        <img
          src={safeSrc}
          alt={alt ?? ''}
          className='h-full w-full object-cover'
          loading='lazy'
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * 수량 입력 (직접 입력 전용 - ERP 스타일)
 * @param {{ value: string, invalid?: boolean, onChange: (v: string) => void }} props
 */
function QtyInput({ value, invalid = false, onChange }) {
  return (
    <div className='flex flex-col items-end gap-1'>
      <Input
        type='text'
        inputMode='numeric'
        value={value}
        placeholder='수량 입력'
        onChange={(e) => {
          const next = e.target.value.replace(/[^\d]/g, '');
          onChange(next);
        }}
        onBlur={(e) => {
          if (!e.target.value) onChange('1');
        }}
        className={`
          h-11 w-[60px] text-right text-base font-bold tabular-nums
          ${invalid ? 'border-destructive focus-visible:ring-destructive' : ''}
        `}
      />
    </div>
  );
}

/**
 * @import { Dispatch, SetStateAction } from 'react';
 */

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

  const { data, isFetching } = useInboundPendingItems(orderNumber, true);
  const items = Array.isArray(data) ? data : [];

  /** @type {[OrderRegisterProduct[], Dispatch<SetStateAction<OrderRegisterProduct[]>>]} */
  const [editableItems, setEditableItems] = useState([]);

  useEffect(() => {
    if (!orderNumber) return;
    if (!Array.isArray(items)) return;

    setEditableItems(
      items.map((it) => ({
        ...it,
        qty: String(it.orderQty ?? 0),
        _baseQty: Number(it.orderQty ?? 0),
      })),
    );
  }, [orderNumber, items]);

  //안전재고: productIds 뽑아서 조회
  const productIds = useMemo(() => {
    const ids = editableItems
      .map((it) => Number(it.productId))
      .filter((n) => Number.isFinite(n) && n > 0);
    return Array.from(new Set(ids));
  }, [editableItems]);

  const safetyQuery = useInboundSafetyStocks({ productIds, enabled: true });

  const safetyMap = useMemo(() => {
    const d = safetyQuery.data;
    return d && typeof d === 'object' ? d : {};
  }, [safetyQuery.data]);

  const totals = useMemo(() => {
    const n = editableItems.length;
    const m = editableItems.reduce((acc, it) => acc + Number(it.qty || 0), 0);
    const amount = editableItems.reduce(
      (acc, it) => acc + Number(it.qty || 0) * Number(it.purchasePrice || 0),
      0,
    );
    const changed = editableItems.reduce((acc, it) => {
      const base = Number(it._baseQty ?? 0);
      const now = Number(it.qty || 0);
      return acc + (base !== now ? 1 : 0);
    }, 0);

    return { n, m, amount, changed };
  }, [editableItems]);

  const memoOver = memo.length > MEMO_MAX;
  const qtyInvalid = editableItems.some((it) => !isValidQty(it.qty));
  const submitDisabled =
    submitting ||
    memoOver ||
    isFetching ||
    !orderNumber ||
    editableItems.length === 0 ||
    qtyInvalid;

  async function handleComplete() {
    setError('');

    if (!orderNumber) return setError('발주번호가 없습니다.');
    if (memoOver) return setError('메모 입력 한도(300자)를 초과했습니다.');
    if (!editableItems.length)
      return setError('해당 발주번호에 품목이 없습니다.');
    if (qtyInvalid) return setError('입고 수량은 1 이상 정수여야 합니다.');

    try {
      setSubmitting(true);

      await completeInboundByOrderNumber(orderNumber, {
        memo: memo || undefined,
        items: editableItems.map((it) => ({
          orderId: Number(it.orderId),
          orderQty: Number(it.qty || 0),
        })),
      });

      await qc.invalidateQueries({ queryKey: ['inbound-pending-summary'] });
      await qc.invalidateQueries({
        queryKey: ['inbound-pending-items', orderNumber],
      });
      await qc.invalidateQueries({
        queryKey: ['inbound-pending-detail', orderNumber],
      });
      await qc.invalidateQueries({
        queryKey: ['inbound-completed-today-summary'],
      });
      await qc.invalidateQueries({
        queryKey: ['inbound-completed-items', orderNumber],
      });
      await qc.invalidateQueries({ queryKey: ['inbound-safety-stocks'] });

      await qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          String(q.queryKey[0] ?? '').startsWith('inbound-'),
      });

      toast.success('입고 완료 처리되었습니다.');
      nav('/dashboard/inbounds/pending');
    } catch (e) {
      setError(/** @type {any} */ (e)?.message || '입고 완료 처리 실패');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='min-h-[calc(100vh-64px)] bg-muted/40'>
      <div className='mx-auto max-w-[1200px] px-5 py-6'>
        {/* 상단 헤더 */}
        <div className='mb-5 flex flex-wrap items-start justify-between gap-3'>
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-xl font-semibold'>입고 등록</h1>
              <Badge variant='secondary'>INBOUND</Badge>
              {isFetching ? <Badge>조회중</Badge> : null}
              {safetyQuery.isFetching ? (
                <Badge variant='secondary'>안전재고 조회중</Badge>
              ) : null}
              {totals.changed > 0 ? (
                <Badge className='bg-amber-500 text-white'>
                  변경 {totals.changed}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        {error && (
          <div className='mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
            {error}
          </div>
        )}

        {/* 전체 높이 고정 그리드 */}
        <div className='grid grid-cols-12 gap-4 lg:min-h-[calc(100vh-64px-140px)]'>
          {/* 좌측: 입고 품목 */}
          <div className='col-span-12 lg:col-span-8 lg:flex'>
            <div className='flex w-full flex-col rounded-2xl border bg-card'>
              {/* 헤더 */}
              <div className='flex items-center justify-between border-b px-5 py-4'>
                <div className='text-lg font-semibold'>입고 품목</div>
                <div className='text-xs text-muted-foreground font-mono'>
                  {orderNumber}
                </div>
              </div>

              {/* 컬럼 라벨 */}
              <div className='grid grid-cols-12 px-5 py-2 text-xs font-semibold text-muted-foreground border-b bg-muted/30'>
                <div className='col-span-6'>품목</div>
                <div className='col-span-3 text-right'>구매/판매 단가</div>
                <div className='col-span-1 text-right'>현재고</div>
                <div className='col-span-2 text-right'>입고수량</div>
              </div>

              {/* 리스트 */}
              <div className='divide-y lg:flex-1 lg:overflow-auto'>
                {editableItems.length ? (
                  editableItems.map((it) => {
                    const invalid = !isValidQty(it.qty);
                    const base = Number(it._baseQty ?? 0);
                    const now = Number(it.qty || 0);
                    const changed = base !== now;

                    const pid = Number(it.productId);
                    const safeRow =
                      Number.isFinite(pid) && pid > 0
                        ? safetyMap[String(pid)]
                        : null;
                    const safetyStock = safeRow?.safetyStock;

                    const current = Number(it.currentStock ?? 0);
                    const safety = Number(safetyStock ?? NaN);
                    const belowSafe =
                      Number.isFinite(safety) && current < safety;

                    return (
                      <div
                        key={it.orderId}
                        className='grid grid-cols-12 items-center px-5 py-4 hover:bg-muted/20 transition'
                      >
                        {/* 품목 */}
                        <div className='col-span-6 flex items-center gap-3'>
                          <Thumb
                            src={it.imageUrl}
                            alt={it.productName}
                          />
                          <div className='min-w-0'>
                            <div className='flex items-center gap-2'>
                              <div className='truncate font-semibold'>
                                {it.productName ?? '-'}
                              </div>
                              {changed && (
                                <Badge className='bg-amber-100 text-amber-700'>
                                  변경됨
                                </Badge>
                              )}
                              {belowSafe ? (
                                <Badge className='bg-red-100 text-red-700'>
                                  안전재고 미달
                                </Badge>
                              ) : null}
                            </div>
                            <div className='mt-1 text-xs text-muted-foreground'>
                              {toKoreanType(it.type)} · {it.brand ?? '-'}
                            </div>
                          </div>
                        </div>

                        {/* 단가 */}
                        <div className='col-span-3 text-right'>
                          <div className='text-sm font-semibold tabular-nums'>
                            구매 {toMoney(it.purchasePrice)}원
                          </div>
                          <div className='text-xs text-muted-foreground tabular-nums'>
                            총{' '}
                            {toMoney(
                              Number(it.purchasePrice || 0) *
                                Number(it.qty || 0),
                            )}
                            원
                            <div className='mt-1 text-[11px] text-muted-foreground tabular-nums'>
                              안전재고{' '}
                              {safetyQuery.isFetching ? (
                                <span>…</span>
                              ) : safetyStock == null ? (
                                <span>-</span>
                              ) : (
                                <span
                                  className={
                                    belowSafe
                                      ? 'text-red-700 font-semibold'
                                      : ''
                                  }
                                >
                                  {toMoney(safetyStock)}개
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 현재고 + 안전재고 */}
                        <div className='col-span-1 text-right'>
                          <div className='text-sm font-bold tabular-nums'>
                            {toMoney(it.currentStock ?? 0)}개
                          </div>
                        </div>

                        {/* 수량 */}
                        <div className='col-span-2 text-right'>
                          <QtyInput
                            value={String(it.qty ?? '')}
                            invalid={invalid}
                            onChange={(next) => {
                              setEditableItems((prev) =>
                                prev.map((x) =>
                                  String(x.orderId) === String(it.orderId)
                                    ? { ...x, qty: next }
                                    : x,
                                ),
                              );
                            }}
                          />
                          {invalid ? (
                            <div className='mt-1 text-[11px] text-destructive'>
                              1 이상 정수
                            </div>
                          ) : (
                            <div className='mt-1 text-[11px] text-muted-foreground'>
                              기존 {base} → 현재 {now}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className='px-4 py-20 text-center text-sm text-muted-foreground'>
                    {isFetching ? '품목 조회 중...' : '품목이 없습니다.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 우측 요약 */}
          <div className='col-span-12 lg:col-span-4'>
            <div className='sticky top-5 space-y-4'>
              <div className='rounded-2xl border bg-card p-5'>
                <div className='mb-3 flex items-center justify-between'>
                  <div className='text-lg font-semibold'>요약</div>
                  <Badge variant='secondary'>확정 전</Badge>
                </div>

                <div className='space-y-3 text-sm'>
                  <div>
                    <div className='text-xs text-muted-foreground'>공급처</div>
                    <div className='font-medium'>{vendorName}</div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>
                      입고 일자
                    </div>
                    <div className='font-medium'>
                      {formatKoreanDateTime(receivedAt)}
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>
                      품목 / 총 수량
                    </div>
                    <div className='font-medium'>
                      {totals.n}종 · {totals.m}개
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>총 금액</div>
                    <div className='text-xl font-bold tabular-nums'>
                      {toMoney(totals.amount)}원
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-2xl border bg-card p-5'>
                <div className='mb-2 flex items-center justify-between'>
                  <div className='font-semibold'>메모</div>
                  <div
                    className={`text-xs ${
                      memoOver ? 'text-destructive' : 'text-muted-foreground'
                    }`}
                  >
                    {memo.length}/{MEMO_MAX}
                  </div>
                </div>

                <Textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={5}
                  placeholder='메모를 입력하세요 (최대 300자)'
                />
              </div>

              <div className='rounded-2xl border bg-card p-5'>
                <IbRegisterDialog
                  totals={totals}
                  submitDisabled={submitDisabled}
                  submitting={submitting}
                  handleComplete={handleComplete}
                />

                <Button
                  variant='secondary'
                  onClick={() => nav(-1)}
                  disabled={submitting}
                  className='w-full mt-2'
                >
                  뒤로
                </Button>
                {memoOver ? (
                  <div className='mt-2 text-xs text-destructive'>
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
