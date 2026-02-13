// @ts-check

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NoticeList } from './notice-list';

/**
 * 
 * @param {{ data: NoticeListResponse }} props 
 */
export const NoticeTable = ({ data }) => {
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
        <NoticeList
          notices={data?.pinned ?? []}
          pinned={true}
        />
        <NoticeList
          notices={data?.items ?? []}
          pinned={false}
        />
      </TableBody>
    </Table>
  );
};
