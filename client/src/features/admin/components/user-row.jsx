// @ts-check

/**
 * Components
 */
import { TableRow, TableCell } from '@/components/ui/table.js';
import { RankCell } from './rank-cell.jsx';
import { RoleCell } from './roll-cell.jsx';
import { UserActionsWrapper } from './user-action-wrapper.jsx';

import { toUserRowModel } from '../schemas/user-model.js';
import { Badge } from '@/components/ui/badge.js';
import { PencilIcon } from 'lucide-react';

const DescriptionCell = ({ user, isPending }) => (
  <TableCell className='w-sm'>
    {!isPending ? user.roleDescription : '-'}
  </TableCell>
);

/**
 * @param {{
 * user: ReturnType<typeof toUserRowModel>,
 * onRankChange: (id: number, type: string) => void,
 * onRoleChange: (id: number, type: string) => void,
 * onResend: (id: number) => void
 * onLeave: (id: number) => void
 * onDelete: (id: number) => void
 * }} props
 */
export const UserRow = ({
  user,
  onRankChange,
  onRoleChange,
  onResend,
  onLeave,
  onDelete,
}) => {
  const isPending = user.status === 'PENDING';

  return (
    <TableRow
      id={String(user.id)}
      className='h-16'
    >
      <TableCell />
      <TableCell>
        <div className='flex gap-2 items-center'>
          <span>{user.name}</span>
          <PencilIcon size={16} />
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>

      {/* 직급 / 권한 / 설명 등 공통 표시 영역 */}
      <RankCell
        user={user}
        onRankChange={onRankChange}
      />

      <RoleCell
        user={user}
        onRoleChange={onRoleChange}
      />

      <DescriptionCell
        user={user}
        isPending={isPending}
      />

      <TableCell className='text-center'>
        <Badge>{user.statusLabel}</Badge>
      </TableCell>

      {/* 액션 영역 (항상 2칸 고정) */}
      <UserActionsWrapper
        user={user}
        onResend={onResend}
        onLeave={onLeave}
        onDelete={onDelete}
      />
    </TableRow>
  );
};
