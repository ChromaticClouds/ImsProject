// @ts-check

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';
import { RECEIVE_ORDER_TABLE_HEADER } from '../constants/index.js';
import { AssignOutboundManager } from './assign-outbound-manager.jsx';
import { useFetchReceiveOrder } from '../hooks/use-fetch-receive-order.js';
import { CardContent } from '@/components/ui/card.js';

export const ReceiveOrderList = ({ searchCond }) => {
  const { orders, mutation } = useFetchReceiveOrder(searchCond);

  return (
    <CardContent className='p-0 h-100 overflow-y-auto relative'>
      <Table>
        <TableHeader className='sticky top-0 z-10'>
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
          {orders.map((o) => (
            <TableRow
              key={o.orderNumber}
              className='text-center h-16'
            >
              <TableCell>{o.orderNumber}</TableCell>
              <TableCell>{o.orderDate}</TableCell>
              <TableCell>{o.vendorName}</TableCell>
              <TableCell>{o.bossName}</TableCell>
              <TableCell>{o.userName}</TableCell>
              <TableCell>{o.itemCount}</TableCell>
              <TableCell>{o.totalPrice}</TableCell>
              <TableCell>{o.receiveDate}</TableCell>
              <TableCell>
                <div className='w-full h-full flex justify-center items-center'>
                  <AssignOutboundManager
                    orderNumber={o.orderNumber}
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
