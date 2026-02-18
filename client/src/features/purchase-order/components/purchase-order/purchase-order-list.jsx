// @ts-check

/**
 * Components
 */
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
import { PoSendDialog } from '@/features/purchase-order/components/purchase-order/po-send-dialog.jsx';

/**
 * Assets
 */
import { PencilIcon, BadgeCheckIcon, BadgeMinusIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useNavigate } from 'react-router-dom';
import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';
import { usePoParamStore } from '@/features/purchase-order/stores/use-po-param-store.js';
import { usePoListContext } from '@/features/purchase-order/providers/po-list-provider.jsx';
import { PoProductDetail } from '@/features/purchase-order/components/purchase-order/po-product-detail.jsx';
import { PoDeleteDialog } from '@/features/purchase-order/components/purchase-order/po-delete-dialog.jsx';
import { Spinner } from '@/components/ui/spinner.js';

const formatNumber = (n) => Number(n || 0).toLocaleString();

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
  if (isComplete(status)) return <BadgeCheckIcon className='w-4 h-4' />;
  if (isPending(status)) return <BadgeMinusIcon className='w-4 h-4' />;
  return null;
};

export const PurchaseOrderList = () => {
  const navigate = useNavigate();

  const { toggle, isSelected } = usePurchaseOrderSelectionStore();

  const view = usePoParamStore((s) => s.view);
  const { content, isFetching } = usePoListContext();

  const isSentView = view === 'SENT';

  const TABLE_HEADER = isSentView
    ? [
        '',
        '상태',
        '발주일',
        '발주번호',
        '납기일',
        '품목 수',
        '공급처',
        '단가총액',
      ]
    : [
        '',
        '상태',
        '발주일',
        '발주번호',
        '납기일',
        '품목 수',
        '공급처',
        '단가총액',
        '수정',
        '전송',
        '삭제',
      ];

  return (
    <Table>
      <TableHeader>
        <TableRow className='bg-border hover:bg-muted'>
          {TABLE_HEADER.map((v, i) => (
            <TableHead
              key={i}
              className='text-center'
            >
              {v}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {isFetching ? (
          <TableRow>
            <TableCell
              className='h-24'
              colSpan={TABLE_HEADER.length}
            >
              <div className='w-full h-full flex items-center justify-center'>
                <Spinner />
              </div>
            </TableCell>
          </TableRow>
        ) : content?.length ? (
          content?.map((c) => {
            return (
              <TableRow key={`${c.orderNumber}-${c.vendorId ?? 'v'}`}>
                <TableCell className='text-center'>
                  {isSentView ? null : (
                    <Checkbox
                      checked={isSelected(c.orderNumber)}
                      onCheckedChange={(checked) =>
                        toggle(c.orderNumber, Boolean(checked))
                      }
                    />
                  )}
                </TableCell>

                {/* 상태 */}
                <TableCell className='text-center'>
                  <span
                    className={`inline-flex items-center gap-1 ${statusClassName(c.status)}`}
                  >
                    <StatusIcon status={c.status} />
                    {statusText(c.status)}
                  </span>
                </TableCell>

                {/* 발주일 */}
                <TableCell className='text-center'>{c.orderDate}</TableCell>

                {/* 발주번호 */}
                <TableCell className='text-center font-medium'>
                  {c.orderNumber}
                </TableCell>

                {/* 납기일 */}
                <TableCell className='text-center'>{c.recieveDate}</TableCell>

                {/* 품목 수 -- 상세 */}
                <TableCell className='text-center'>
                  <PoProductDetail content={c} />
                </TableCell>

                {/* 공급처명 */}
                <TableCell className='text-center'>
                  {c.vendorName ?? '-'}
                </TableCell>

                {/* 단가총액 */}
                <TableCell className='text-center font-medium'>
                  {formatNumber(c.totalPrice)}원
                </TableCell>

                {isSentView ? null : (
                  <>
                    {/* 수정 */}
                    <TableCell className='text-center'>
                      <Button
                        size='sm'
                        variant='secondary'
                        disabled={isSentView}
                        onClick={() =>
                          navigate(`${encodeURIComponent(c.orderNumber)}/edit`)
                        }
                      >
                        <PencilIcon />
                        수정
                      </Button>
                    </TableCell>

                    {/* 전송 */}
                    <TableCell className='text-center'>
                      <PoSendDialog content={c} />
                    </TableCell>

                    {/* 삭제 */}
                    <TableCell className='text-center'>
                      {/* <Button
                        variant='destructive'
                        size='sm'
                        onClick={async () => {
                          const ok = window.confirm('삭제 하시겠습니까?');
                          if (!ok) return;
                          await remove(c.orderNumber);
                        }}
                      >
                        <Trash2Icon />
                        삭제
                      </Button> */}
                      <PoDeleteDialog />
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
