import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

/**
 * @typedef {object} NoticeProps
 * @property {NoticeListResponse['items']} notices
 * @property {boolean} pinned
 */

/**
 * @param {NoticeProps} props
 */
export const NoticeList = ({ pinned, notices }) => {
  return notices.map((notice) => (
    <TableRow
      key={notice.id}
      className='cursor-pointer hover:bg-muted'
      onClick={() => onSelect?.(notice.id)}
    >
      <TableCell>{notice.id}</TableCell>
      <TableCell className='flex items-center gap-2'>
        {pinned && <Badge>공지</Badge>}

        {notice.title}
      </TableCell>
      <TableCell>{notice.id}</TableCell>
      <TableCell>{notice.createdAt}</TableCell>
    </TableRow>
  ));
};
