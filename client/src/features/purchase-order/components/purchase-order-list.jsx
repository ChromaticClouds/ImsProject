// @ts-check
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog.js';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.js';
import {
  SendIcon,
  Trash2Icon,
  PencilIcon,
  ChevronDownIcon,
  BadgeCheckIcon,
  BadgeMinusIcon,
} from 'lucide-react';

import { usePurchaseOrders, purchaseOrderStatus } from '@/features/purchase-order/hooks/use-purchase-orders.js';
import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';
import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';

const formatNumber = (n) => Number(n || 0).toLocaleString();

/**
 * 날짜
 * @param {string | null | undefined} dateStr
 */
const formatDateWithDay = (dateStr) => {
  if (!dateStr) return '-';

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const day = week[d.getDay()];

  // YYYY-MM-DD만 표시 (datetime 잘림 방지)
  const s = String(dateStr);
  const dateOnly = s.length >= 10 ? s.slice(0, 10) : s;

  return `${dateOnly} (${day})`;
};

const isPending = (status) => status === 'INBOUND_PENDING';
const isComplete = (status) => status === 'INBOUND_COMPLETE';

const statusText = (status) => {
  if (isPending(status) || isComplete(status)) return '전송 완료';
  return '전송 전';
};

const statusClassName = (status) => {
  if (isComplete(status)) return 'text-emerald-600 font-medium';
  if (isPending(status)) return 'text-amber-600 font-medium';
  return 'text-amber-600 font-medium'; // 전송 전
};

const StatusIcon = ({ status }) => {
  if (isComplete(status)) return <BadgeCheckIcon className="h-4 w-4" />;
  if (isPending(status)) return <BadgeMinusIcon className="h-4 w-4" />;
  return null;
};

const typeLabelMap = {
  SOJU: '소주',
  LIQUOR: '양주',
  KAOLIANG_LIQUOR: '고량주',
  TRADITIONAL: '전통주',
  WHISKEY: '위스키',
};
const formatType = (type) => typeLabelMap[type] ?? type ?? '-';

/** @param {{ src?: string, alt?: string, size?: number }} props */
export function ZoomImage({ src, alt, size = 48 }) {
  const safeSrc = typeof src === 'string' ? src.trim() : '';
  const [open, setOpen] = useState(false);

  const boxStyle = useMemo(
    () => ({ width: size, height: size, minWidth: size, minHeight: size }),
    [size]
  );

  // ✅ 이미지가 없어도 "박스는 항상 고정" (레이아웃 흔들림 방지)
  if (!safeSrc) {
    return (
      <div
        style={boxStyle}
        className="shrink-0 overflow-hidden rounded-md border bg-muted"
      />
    );
  }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <button
//           type="button"
//           className="group relative h-12 w-12 overflow-hidden rounded-md border bg-muted"
//           onMouseDown={(e) => e.stopPropagation()}
//           onClick={(e) => e.stopPropagation()}
//           aria-label="이미지 확대"
//           title="클릭하여 확대"
//         >
//           <img
//             src={safeSrc}
//             alt={alt ?? ''}
//             className="h-full w-full object-cover transition-transform group-hover:scale-105"
//             loading="lazy"
//             onError={(e) => {
//               // 이미지가 깨지면 썸네일만 숨김
//               e.currentTarget.style.display = 'none';
//             }}
//           />
//         </button>
//       </DialogTrigger>

//       <DialogContent
//         className="max-w-[92vw] p-0"
//         onOpenAutoFocus={(e) => e.preventDefault()}
//       >
//         {/* 큰 이미지 클릭하면 닫힘 */}
//         <button
//           type="button"
//           className="block w-full"
//           onClick={() => setOpen(false)}
//           aria-label="닫기"
//           title="클릭하여 닫기"
//         >
//           <img
//             src={safeSrc}
//             alt={alt ?? ''}
//             className="max-h-[85vh] w-full object-contain"
//           />
//         </button>
//       </DialogContent>
//     </Dialog>
//   );
// }

return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          style={boxStyle}
          className="shrink-0 overflow-hidden rounded-md border bg-muted"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          aria-label="이미지 확대"
          title="클릭하여 확대"
        >
          <img
            src={safeSrc}
            alt={alt ?? ''}
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '';
            }}
          />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[92vw] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <button type="button" className="block w-full" onClick={() => setOpen(false)} aria-label="닫기">
          <img
            src={safeSrc}
            alt={alt ?? ''}
            className="max-h-[85vh] w-full object-contain"
            style={{ display: 'block' }}
          />
        </button>
      </DialogContent>
    </Dialog>
  );
}

/** @param {{rows:any[], onReload:()=>Promise<any>}} props */
export const PurchaseOrderList = ({ rows, onReload }) => {
  const navigate = useNavigate();

  const { remove, markSent } = usePurchaseOrders();
  const { view } = usePurchaseOrderFilterStore();
  const { toggle, isSelected } = usePurchaseOrderSelectionStore();

  const formatSafetyStock = (v) => {
    if (v == null) return '-';
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v);
    return n.toFixed(1);
  };

  const isSentView = view === 'SENT';

  const TABLE_HEADER = isSentView
    ? ['', '상태', '발주일', '발주번호', '납기일', '품목 수', '공급처', '단가총액']
    : ['', '상태', '발주일', '발주번호', '납기일', '품목 수', '공급처', '단가총액', '수정', '전송', '삭제'];

  const safeRows = useMemo(() => (Array.isArray(rows) ? rows : []), [rows]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-border hover:bg-muted">
          {TABLE_HEADER.map((v, i) => (
            <TableHead key={i} className="text-center">
              {v}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {safeRows.length ? (
          safeRows.map((r) => {
            const draft = purchaseOrderStatus.isDraft(r.status);

            const items = Array.isArray(r.items) ? r.items : [];
            const itemCountLabel = `${Number(r.itemKinds ?? items.length ?? 0)}개`;

            return (
              <TableRow key={`${r.orderNumber}-${r.vendorId ?? 'v'}`}>
                <TableCell className="text-center">
                  {isSentView ? null : (
                    <Checkbox
                      checked={isSelected(r.orderNumber)}
                      onCheckedChange={(checked) =>
                        toggle(r.orderNumber, Boolean(checked))
                      }
                    />
                  )}
                </TableCell>

                {/* 상태 */}
                <TableCell className="text-center">
                  <span className={`inline-flex items-center gap-1 ${statusClassName(r.status)}`}>
                    <StatusIcon status={r.status} />
                    {statusText(r.status)}
                  </span>
                </TableCell>

                {/* 발주일 */}
                <TableCell className="text-center">{formatDateWithDay(r.orderDate)}</TableCell>

                {/* 발주번호 */}
                <TableCell className="text-center font-medium">{r.orderNumber}</TableCell>

                {/* 납기일 */}
                <TableCell className="text-center">{formatDateWithDay(r.recieveDate)}</TableCell>

                {/* 품목 수 -- 상세 */}
                <TableCell className="text-center">
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {itemCountLabel}
        <ChevronDownIcon className="h-4 w-4" />
      </Button>
    </PopoverTrigger>

    <PopoverContent
      align="start"
      className="w-[520px] p-4"
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold">발주 품목 상세</div>

        <div className="overflow-hidden rounded-lg border">
     
          <div className="grid h-9 grid-cols-12 items-center bg-muted px-3 text-xs font-medium">
            <div className="col-span-4 flex items-center">품목명</div>
            <div className="col-span-2 flex items-center justify-center">주종</div>
            <div className="col-span-2 flex items-center justify-center">브랜드</div>
            <div className="col-span-2 flex items-center justify-center">안전재고</div>
            <div className="col-span-2 flex items-center justify-center">발주수량</div>
          </div>

          {items.length ? (
            items.map((it) => (
            
              <div
                key={it.orderId}
                className="grid min-h-[56px] grid-cols-12 items-center border-t px-3 py-2 text-sm"
              >
                {/* 품목명 + 이미지 */}
                <div className="col-span-4 flex items-center gap-3">
                  <ZoomImage src={it.imageUrl ?? ''} alt={it.productName} />
                  <div className="min-w-0">
                    <div className="truncate">
                      {it.productName ?? `상품ID ${it.productId}`}
                    </div>
                  </div>
                </div>

             
                <div className="col-span-2 flex items-center justify-center">
                  {formatType(it.type)}
                </div>
                <div className="col-span-2 flex items-center justify-center text-center">
                  {it.brand ?? '-'}
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  {it.safetyStock}
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  {it.count ?? 0}
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              등록된 발주 품목이 없습니다
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          합계 수량: {formatNumber(r.totalCount)}
        </div>
      </div>
    </PopoverContent>
  </Popover>
</TableCell>


                {/* 공급처명 */}
                <TableCell className="text-center">{r.vendorName ?? '-'}</TableCell>

                {/* 단가총액 */}
                <TableCell className="text-center font-medium">
                  {formatNumber(r.totalPrice)}원
                </TableCell>

                {isSentView ? null : (
                  <>
                    {/* 수정 */}
                    <TableCell className="text-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                        disabled={!draft}
                        onClick={() => navigate(`${encodeURIComponent(r.orderNumber)}/edit`)}
                      >
                        <PencilIcon className="h-4 w-4" />
                        수정
                      </Button>
                    </TableCell>

                    {/* 전송 */}
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        className="gap-2"
                        disabled={!draft}
                        onClick={async () => {
                          const message =
                            `이 발주서를 전송하시겠습니까?\n\n` +
                            `공급처: ${r.vendorName ?? '-'}\n` +
                            `발주번호: ${r.orderNumber}\n` +
                            `발주일: ${r.orderDate}\n` +
                            `납기일: ${r.recieveDate}\n` +
                            `품목 수: ${r.itemKinds ?? 0}개\n` +
                            `총 수량: ${r.totalCount ?? 0}`;

                          const ok = window.confirm(message);
                          if (!ok) return;

                          await markSent(r.orderNumber);
                          await onReload();
                        }}
                      >
                        <SendIcon className="h-4 w-4" />
                        전송
                      </Button>
                    </TableCell>

                    {/* 삭제 */}
                    <TableCell className="text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={async () => {
                          const ok = window.confirm('삭제 하시겠습니까?');
                          if (!ok) return;

                          await remove(r.orderNumber);
                          await onReload();
                        }}
                      >
                        <Trash2Icon className="h-4 w-4" />
                        삭제
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={TABLE_HEADER.length}
              className="py-10 text-center text-muted-foreground"
            >
              표시할 발주 내역이 없습니다
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
