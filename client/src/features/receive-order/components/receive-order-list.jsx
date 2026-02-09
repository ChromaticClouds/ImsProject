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
import { useQuery } from '@tanstack/react-query';
import { getReceiveOrders } from '../api/index.js';
import { Select } from '@/components/ui/select.js';

export const ReceiveOrderList = () => {
  const { data, error, isFetching } = useQuery({
    queryKey: ['receive-orders'],
    queryFn: getReceiveOrders,
  });

  const orders = data?.data ?? [];
  
  return (
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
        {orders.map((o) => (
          <TableRow className='text-center h-16'>
            <TableCell>{o.orderNumber}</TableCell>
            <TableCell>{o.orderDate}</TableCell>
            <TableCell>{o.vendorName}</TableCell>
            <TableCell>{o.bossName}</TableCell>
            <TableCell>{o.userName}</TableCell>
            <TableCell>{o.itemCount}</TableCell>
            <TableCell>{o.totalPrice}</TableCell>
            <TableCell>{o.receiveDate}</TableCell>
            <TableCell><Select></Select></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
