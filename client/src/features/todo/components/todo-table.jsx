import { MoreHorizontal } from 'lucide-react';
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const STATUS_BADGE = {
  TODO: '미완료',
  IN_PROGRESS: '진행중',
  DONE: '완료',
};

export const TodoTable = ({ todos, onDetail, onEdit, onDelete, onComplete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-20'>번호</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className='w-28'>상태</TableHead>
          <TableHead className='w-28'>작성자</TableHead>
          <TableHead className='w-36'>기간</TableHead>
          <TableHead className='w-14'></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {todos.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className='text-center py-6'>
              업무 목록이 없습니다.
            </TableCell>
          </TableRow>
        )}

        {todos.map((t) => (
          <TableRow key={t.id} className='hover:bg-muted'>
            <TableCell>{t.id}</TableCell>
            <TableCell className='cursor-pointer' onClick={() => onDetail?.(t)}>
              {t.title}
            </TableCell>
            <TableCell>
              <Badge variant='secondary'>{STATUS_BADGE[t.status] ?? t.status}</Badge>
            </TableCell>
            <TableCell>{t.userId}</TableCell>
            <TableCell className='text-sm text-muted-foreground'>
              {t.startDate} ~ {t.endDate}
            </TableCell>
            <TableCell className='text-right'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MoreHorizontal className='w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => onDetail?.(t)}>상세</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(t.id)}>수정</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete?.(t.id)}>삭제</DropdownMenuItem>
                  {t.status !== 'DONE' && (
                    <DropdownMenuItem onClick={() => onComplete?.(t.id)}>
                      완료
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
