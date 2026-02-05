import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export const NoticeTable = ({ notices, onSelect }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-20'>번호</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className='w-32'>작성자</TableHead>
          <TableHead className='w-32'>작성일</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {notices.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className='text-center py-6'>
              등록된 공지사항이 없습니다.
            </TableCell>
          </TableRow>
        )}

        {notices.map((notice) => (
          <TableRow
            key={notice.id}
            className='cursor-pointer hover:bg-muted'
            onClick={() => onSelect(notice.id)}
          >
            <TableCell>{notice.id}</TableCell>
            <TableCell className='flex items-center gap-2'>
              {notice.pinned && <Badge>공지</Badge>}
              {notice.title}
            </TableCell>
            <TableCell>{notice.userId}</TableCell>
            <TableCell>{notice.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
