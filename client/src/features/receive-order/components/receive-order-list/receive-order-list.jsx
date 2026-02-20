// @ts-check

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';
import { RECEIVE_ORDER_TABLE_HEADER } from '../../constants/index.js';
import { AssignOutboundManager } from './assign-outbound-manager.jsx';
import { CardContent } from '@/components/ui/card.js';
import { ReceiveOrderDetail } from './receive-order-detail.jsx';
import { useAssignManager } from '@/features/receive-order/hooks/use-assign-manager.js';
import { useRoListContext } from '@/features/receive-order/providers/ro-list-provider.jsx';

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
export const ReceiveOrderList = () => {
  const { content = [] } = useRoListContext();
  const { mutation } = useAssignManager();

  return (
    <CardContent className='p-0'>
      <Table>
        <TableHeader>
          <TableRow className='bg-accent'>
            {RECEIVE_ORDER_TABLE_HEADER.map((head) => (
              <TableHead
                className='text-center'
                key={head}
              >
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.length > 0 ? (
            content?.map((o) => (
              <TableRow
                key={o.orderNumber}
                className='text-center h-16'
              >
                <TableCell className='text-muted-foreground font-mono'>
                  {o.orderNumber}
                </TableCell>
                <TableCell>{formatDateWithDay(o.orderDate)}</TableCell>
                <TableCell>{o.vendorName}</TableCell>
                <TableCell>{o.bossName}</TableCell>
                <TableCell>{o.userName}</TableCell>
                <ReceiveOrderDetail order={o} />
                <TableCell>{o.totalPrice}</TableCell>
                <TableCell>{formatDateWithDay(o.receiveDate)}</TableCell>
                <TableCell>
                  <div className='w-full h-full flex justify-center items-center'>
                    <AssignOutboundManager
                      manager={{
                        managerName: o.managerName,
                        managerId: o.managerId,
                      }}
                      onChange={(nextManagerId) =>
                        mutation.mutate({
                          orderNumber: o.orderNumber,
                          managerId: nextManagerId,
                        })
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={RECEIVE_ORDER_TABLE_HEADER.length}>
                <div className='flex h-24 items-center justify-center'>
                  데이터가 없습니다
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  );
};