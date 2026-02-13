// @ts-check
import { useMemo } from 'react';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.js';

import { SendIcon, Trash2Icon, PencilIcon, ChevronDownIcon } from 'lucide-react';

import {
  usePurchaseOrders,
  purchaseOrderStatus,
} from '@/features/purchase-order/hooks/use-purchase-orders.js';

import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';
import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';

//  vendor mock 
import { testvendors } from '@/features/purchase-order/mocks/test-vendor-mock.js';
//  vendor-item mock 
import { testvendorItems } from '@/features/purchase-order/mocks/test-vendor-item-mock.js';
//  발주서 상세  mock
import { purchaseOrderItems } from '@/features/purchase-order/mocks/purchase-order-item-mock.js';
// product mock (Popover 상세 출력용)
import { MOCK_PRODUCTS } from '@/features/product/mocks/product.js';

const statusLabel = (status) =>
  status === 'INBOUND_PENDING' ? '전송 완료' : '전송 전';

const formatNumber = (n) => Number(n || 0).toLocaleString();

export const PurchaseOrderList = ({rows}) => {
  const navigate = useNavigate();

  const { remove, markSent } = usePurchaseOrders();

  // ✅ view/keyword/range를 직접 구독해서 filtered가 재계산되게 함
  const { view, keyword, range, filterFn } = usePurchaseOrderFilterStore();

  const { toggle, isSelected } = usePurchaseOrderSelectionStore();

  const isSentView = view === 'SENT';

  // ✅ view/keyword/range를 deps로 넣어야 버튼 눌렀을 때 바로 갱신됨
  const filtered = useMemo(
    () => rows.filter(filterFn),
    // filterFn은 zustand 내부 고정 함수라 참조가 안 바뀔 수 있음
    // 그래서 view/keyword/range로 강제 재계산 트리거
    [rows, view, keyword, range]
  );

  const TABLE_HEADER = isSentView
    ? ['', '상태', '발주일', '발주번호', '납기일', '품목 수', '거래처ID', '총액']
    : ['', '상태', '발주일', '발주번호', '납기일', '품목 수', '거래처ID', '수정', '전송', '삭제'];

  return (
    <Table>
      <TableHeader>
        <TableRow className='bg-border hover:bg-muted'>
          {TABLE_HEADER.map((v, i) => (
            <TableHead key={i} className='text-center'>
              {v}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {filtered?.length ? (
          filtered.map((r) => {
            const sent = purchaseOrderStatus.isSent(r.status);
            const draft = purchaseOrderStatus.isDraft(r.status);

            const vendor = testvendors.find(
              (v) => String(v.id) === String(r.sellerVendorId)
            );

            // ✅ 이 발주서에 포함된 품목들(2~3개 가능)
            const items = purchaseOrderItems.filter(
              (it) => String(it.purchaseOrderId) === String(r.id)
            );

            const itemCountLabel = `${items.length || 0}개`;

            // ✅ 전송 confirm/표시용 총 수량(아이템 합산)
            const totalCount = items.reduce(
              (sum, it) => sum + Number(it.count || 0),
              0
            );

            // ✅ 전송 완료 화면 총액: 여러 품목 합산(단가표 * 수량)
            const totalPrice = items.reduce((sum, it) => {
              const vi = testvendorItems.find(
                (x) => String(x.id) === String(it.venderItemId)
              );
              const unit = Number(vi?.purchasePrice || 0);
              return sum + unit * Number(it.count || 0);
            }, 0);

            return (
              <TableRow key={r.id}>
                {/* 체크박스: 전송 완료 내역에서는 숨김 */}
                <TableCell className='text-center'>
                  {isSentView ? null : (
                    <Checkbox
                      checked={isSelected(r.id)}
                      onCheckedChange={(checked) =>
                        toggle(r.id, Boolean(checked))
                      }
                    />
                  )}
                </TableCell>

                {/* 상태 */}
                <TableCell className='text-center'>
                  <span
                    className={
                      sent
                        ? 'text-emerald-600 font-medium'
                        : 'text-amber-600 font-medium'
                    }
                  >
                    {statusLabel(r.status)}
                  </span>
                </TableCell>

                {/* 발주일 */}
                <TableCell className='text-center'>{r.orderDate}</TableCell>

                {/* 발주번호 */}
                <TableCell className='text-center font-medium'>
                  {r.orderNumber}
                </TableCell>

                {/* 납기일 */}
                <TableCell className='text-center'>{r.recieveDate}</TableCell>

                {/*  품목 수 (Popover 상세) */}
                <TableCell className='text-center'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='gap-2'
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {itemCountLabel}
                        <ChevronDownIcon className='w-4 h-4' />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      align='start'
                      className='w-[520px] p-4'
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <div className='flex flex-col gap-3'>
                        <div className='text-sm font-semibold'>
                          발주 품목 상세
                        </div>

                        <div className='rounded-lg border overflow-hidden'>
                          <div className='grid grid-cols-12 text-xs font-medium bg-muted px-3 py-2'>
                            <div className='col-span-4'>품목명</div>
                            <div className='col-span-2 text-center'>주종</div>
                            <div className='col-span-2 text-center'>브랜드</div>
                            <div className='col-span-2 text-center'>안전재고</div>
                            <div className='col-span-2 text-center'>발주수량</div>
                          </div>

                          {items.length ? (
                            items.map((it) => {
                              const p = MOCK_PRODUCTS?.find(
                                (x) => String(x.id) === String(it.productId)
                              );

                              return (
                                <div
                                  key={it.id}
                                  className='grid grid-cols-12 px-3 py-2 text-sm border-t'
                                >
                                  <div className='col-span-4 truncate'>
                                    {p?.name ?? `상품ID ${it.productId}`}
                                  </div>
                                  <div className='col-span-2 text-center'>
                                    {p?.type ?? '-'}
                                  </div>
                                  <div className='col-span-2 text-center'>
                                    {p?.brand ?? '-'}
                                  </div>
                                  <div className='col-span-2 text-center'>
                                    {p?.safetyStock ?? '-'}
                                  </div>
                                  <div className='col-span-2 text-center'>
                                    {it.count ?? 0}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className='px-3 py-6 text-sm text-muted-foreground text-center'>
                              등록된 발주 품목이 없습니다
                            </div>
                          )}
                        </div>

                        <div className='text-xs text-muted-foreground'>
                          합계 수량: {formatNumber(totalCount)}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>

                {/* 거래처ID */}
                <TableCell className='text-center'>{r.sellerVendorId}</TableCell>

                {/*  전송 완료 내역일 때: 여러 품목 합산 총액 */}
                {isSentView ? (
                  <TableCell className='text-center font-medium'>
                    {formatNumber(totalPrice)}원
                  </TableCell>
                ) : (
                  <>
                    {/* 수정 */}
                    <TableCell className='text-center'>
                      <Button
                        variant='secondary'
                        size='sm'
                        className='gap-2'
                        disabled={!draft}
                        onClick={() => navigate(`${r.id}/edit`)}
                      >
                        <PencilIcon className='w-4 h-4' />
                        수정
                      </Button>
                    </TableCell>

                    {/* 전송 */}
                    <TableCell className='text-center'>
                      <Button
                        size='sm'
                        className='gap-2'
                        disabled={!draft}
                        onClick={() => {
                          const message =
                            `이 정보가 맞습니까?\n\n` +
                            `공급처명: ${vendor?.vendorName ?? '-'}\n` +
                            `대표자명: ${vendor?.bossName ?? '-'}\n` +
                            `전화번호: ${vendor?.telephone ?? '-'}\n` +
                            `이메일: ${vendor?.email ?? '-'}\n\n` +
                            `발주번호: ${r.orderNumber}\n` +
                            `발주일: ${r.orderDate}\n` +
                            `납기일: ${r.recieveDate}\n` +
                            `발주 수량(합계): ${totalCount}`;

                          const ok = window.confirm(message);
                          if (!ok) return;

                          markSent(r.id);
                        }}
                      >
                        <SendIcon className='w-4 h-4' />
                        전송
                      </Button>
                    </TableCell>

                    {/* 삭제 */}
                    <TableCell className='text-center'>
                      <Button
                        variant='destructive'
                        size='sm'
                        className='gap-2'
                        onClick={() => {
                          const ok = window.confirm('삭제 하시겠습니까?');
                          if (!ok) return;
                          remove(r.id);
                        }}
                      >
                        <Trash2Icon className='w-4 h-4' />
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
              className='text-center py-10 text-muted-foreground'
            >
              표시할 발주 내역이 없습니다
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
