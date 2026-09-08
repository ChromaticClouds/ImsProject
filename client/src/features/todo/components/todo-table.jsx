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
  IN_ACTIVE: '진행중', // 백엔드 Enum 매칭
  COMPLETE: '완료',    // 백엔드 Enum 매칭
  // 기존 mock 데이터용 (하이브리드 대응)
  TODO: '미완료',
  IN_PROGRESS: '진행중',
  DONE: '완료',
};

export const TodoTable = ({
  todos,
  onDetail,
  onEdit,
  onDelete,
  onComplete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-20'>번호</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className='w-28'>상태</TableHead>
          <TableHead>태그</TableHead>
          <TableHead className='w-32'>등록일</TableHead>
          <TableHead className='w-36'>기간</TableHead>
          <TableHead className='w-14'></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {todos.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className='text-center py-6'>
              업무 목록이 없습니다.
            </TableCell>
          </TableRow>
        )}

        {todos.map((t) => (
          <TableRow key={t.id} className='hover:bg-muted'>
            <TableCell>{t.id}</TableCell>

            <TableCell
              className='cursor-pointer font-medium'
              onClick={() => onDetail?.(t)}
            >
              {t.title}
            </TableCell>

            <TableCell>
              <Badge variant='secondary'>
                {STATUS_BADGE[t.status] ?? t.status}
              </Badge>
            </TableCell>

            {/* 설명부분 너무 길다 */}
            {/* <TableCell className='max-w-xs truncate'>
              {t.description || '-'}
            </TableCell> */}

            <TableCell>
              <div className='flex gap-1 flex-wrap'>
                {(() => {
                  try {
                    // 1. 데이터가 아예 없는 경우
                    if (!t.tags) return null;
                    
                    // 2. 데이터가 문자열(JSON)로 넘어온 경우 파싱
                    const tagList = typeof t.tags === 'string' ? JSON.parse(t.tags) : t.tags;
                    
                    // 3. 배열인지 확인 후 map 실행
                    if (Array.isArray(tagList)) {
                      return tagList.map((tag) => (
                        <Badge key={tag} variant='secondary'>
                          {tag}
                        </Badge>
                      ));
                    }
                  } catch (e) {
                    console.error("Tag parsing error:", e);
                  }
                  return null;
                })()}
              </div>
            </TableCell>

            <TableCell>{t.createdAt}</TableCell>

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
                  <DropdownMenuItem onClick={() => onDetail?.(t)}>
                    상세
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onEdit?.(t.id)}>
                    수정
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onDelete?.(t.id)}>
                    삭제
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onComplete?.(t.id)}>
                    {t.status === 'DONE' ? '다시 진행' : '완료'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
