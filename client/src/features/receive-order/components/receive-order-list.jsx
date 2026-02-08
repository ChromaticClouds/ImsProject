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

const TABLE_HEADER = [
  '수주번호',
  '수주일',
  '판매처',
  '대표자명',
  '담당자',
  '품목 수',
  '단가 총액',
  '납기희망일',
  '출고 담당자',
];

export const ReceiveOrderList = () => {

  
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
        <TableRow>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
