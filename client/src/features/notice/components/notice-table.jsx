// @ts-check

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NoticeList } from './notice-list';
import { Spinner } from '@/components/ui/spinner.js';

/**
 *
 * @param {{ data: NoticeListResponse }} props
 */
export const NoticeTable = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead className='w-20'>번호</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className='w-32'>작성자</TableHead>
          <TableHead className='w-32'>작성일</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {!data?.items && !data?.pinned ? (
          <TableRow>
            <TableCell colSpan={4}>
              <div className='h-24 flex justify-center items-center'>
                <Spinner />
              </div>
            </TableCell>
          </TableRow>
        ) : (
          <>
            <NoticeList
              notices={data?.pinned ?? []}
              pinned={true}
            />

            <NoticeList
              notices={data?.items ?? []}
              pinned={false}
            />
          </>
        )}
      </TableBody>
    </Table>
  );
};
