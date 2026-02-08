//@ts-check
import { useMemo } from 'react';

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

import { SendIcon, Trash2Icon, PencilIcon } from 'lucide-react';

import { usePurchaseOrders, purchaseOrderStatus } from '@/features/purchase-order/hooks/use-purchase-orders.js';
import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';
import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';

const TABLE_HEADER = [
  '',
  '상태',
  '발주일',
  '발주번호',
  '납기일',
 
  '수량',
  
  '거래처ID',
  
];

const statusLabel = (status) =>
  status === 'INBOUND_PENDING' ? '전송 완료' : '전송 전';

export const PurchaseOrderList = () => {
  const { rows, remove, markSent } = usePurchaseOrders();
  const { filterFn } = usePurchaseOrderFilterStore();
  const { toggle, isSelected } = usePurchaseOrderSelectionStore();

  const filtered = useMemo(() => rows.filter(filterFn), [rows, filterFn]);

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

            return (
              <TableRow key={r.id}>
                {/* 체크 */}
                <TableCell className='text-center'>
                  <Checkbox
                    checked={isSelected(r.id)}
                    onCheckedChange={(checked) => toggle(r.id, Boolean(checked))}
                  />
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

              

                {/* 수량 */}
                <TableCell className='text-center'>{r.count}</TableCell>

               

                {/* 거래처ID */}
                <TableCell className='text-center'>{r.sellerVendorId}</TableCell>

                {/* 수정 */}
                <TableCell className='text-center'>
                  <Button
                    variant='secondary'
                    size='sm'
                    className='gap-2'
                    disabled={!draft}
                    onClick={() =>
                      console.log('go: /dashbord/purchase-order/edit', r.id)
                    }
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
                    onClick={() => markSent(r.id)}
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
