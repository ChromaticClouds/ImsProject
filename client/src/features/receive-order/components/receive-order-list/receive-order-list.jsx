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

export const ReceiveOrderList = () => {
  const { content = [] } = useRoListContext();
  const { mutation } = useAssignManager();

  return (
    <CardContent className='p-0'>
      <Table>
        <TableHeader>
          <TableRow className='bg-accent'>
            {RECEIVE_ORDER_TABLE_HEADER.map((head) => (
              <TableHead className='text-center' key={head}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {content?.map((o) => (
            <TableRow
              key={o.orderNumber}
              className='text-center h-16'
            >
              <TableCell>{o.orderNumber}</TableCell>
              <TableCell>{o.orderDate}</TableCell>
              <TableCell>{o.vendorName}</TableCell>
              <TableCell>{o.bossName}</TableCell>
              <TableCell>{o.userName}</TableCell>
              <ReceiveOrderDetail order={o} />
              <TableCell>{o.totalPrice}</TableCell>
              <TableCell>{o.receiveDate}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </CardContent>
  );
};
