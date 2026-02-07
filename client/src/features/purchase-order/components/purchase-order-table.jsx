import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const STATUS_LABEL = new Map([
  [null, '전송 전'],
  ['INBOUND_PENDING', '전송 완료'],
]);

/**
 * 
 * @param {{ orders: PurchaseOrder[] }} props 
 * @returns 
 */
export const PurchaseOrderTable = ({ orders, tab, onSend, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
         
          <TableHead className='w-44'>발주번호</TableHead>
          <TableHead className='w-28'>상태</TableHead>
          <TableHead className='w-28'>발주일</TableHead>
          <TableHead className='w-32'>거래처</TableHead>
          <TableHead className='w-20 text-center'>수량</TableHead>
          <TableHead className='w-20 text-right'>단가총액</TableHead>
          <TableHead className='w-20 text-right'>납기일</TableHead>
          
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className='text-center py-6'>
              발주 내역이 없습니다.
            </TableCell>
          </TableRow>
        )}

        {orders.map((o) => {
          const isBeforeSend = o.status === null;

          return (
            <TableRow key={o.id}>
              
              {/* 발주 번호 */}
              <TableCell className='font-medium'>{o.orderNumber}</TableCell>
              {/* 상태 */}
              <TableCell>
                {/* <Badge variant='secondary'>
                  {isBeforeSend ? STATUS_LABEL.null : STATUS_LABEL.INBOUND_PENDING}
                </Badge> */}
                
                 <Badge variant={isBeforeSend ? 'outline' : 'secondary'}>
                  {STATUS_LABEL.get(o.status)}
                </Badge>
                
              </TableCell>
              {/* 발주일 */}
              <TableCell>{o.orderDate}</TableCell>
              {/* 거래처 */}
              <TableCell>{o.sellerVendorId}(번호)</TableCell>
              {/* 수량 */}
              <TableCell className='text-center'>{o.count}박스</TableCell>
              {/* 단가총액 */}
              <TableCell className='text-right'>단가data*{o.count}원</TableCell>
              {/* 납기일 */}
              <TableCell className='text-right'>{o.recieveDate}</TableCell>
              
              {/* 필요 없을 듯 하다 */}
              {/* <TableCell className='text-right'>
                {tab === 'BEFORE_SEND' ? (
                  <div className='flex justify-end gap-2'>
                    <Button size='sm' onClick={() => onSend?.(o.id)}>
                      전송
                    </Button>
                    <Button size='sm' variant='destructive' onClick={() => onDelete?.(o.id)}>
                      삭제
                    </Button>
                  </div>
                ) : (
                  <div className='text-sm text-muted-foreground'>
                    전송 완료됨
                  </div>
                )}
              </TableCell> */}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
