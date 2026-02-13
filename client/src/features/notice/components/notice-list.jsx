import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * @typedef {object} NoticeProps
 * @property {NoticeListResponse['items']} notices
 * @property {boolean} pinned
 */

/**
 * @param {NoticeProps} props
 */
export const NoticeList = ({ pinned, notices }) => {
  const navigate = useNavigate();

  return notices.map((notice) => (
    <TableRow
      key={notice.id}
      className='cursor-pointer hover:bg-muted'
      onClick={() => navigate(`/dashboard/notice/${notice.id}`)}
    >
      <TableCell>{notice.id}</TableCell>
      <TableCell className='flex items-center gap-2'>
        {pinned ? (
                      <span className="shrink-0 rounded-lg bg-red-700 px-2 py-0.5 text-xs font-medium text-red-50">
                        중요
                      </span>
                    ) : null}

        {notice.title}
      </TableCell>
      <TableCell>{notice.userName}</TableCell>
      <TableCell>{notice.createdAt}</TableCell>
    </TableRow>
  ));
};
