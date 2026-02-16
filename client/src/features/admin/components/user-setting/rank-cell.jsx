// @ts-check

import { TableCell } from '@/components/ui/table.js';
import { RankSelect } from './rank-select.jsx';
import { toUserRowModel } from '../../schemas/user-model.js';
import { cn } from '@/lib/utils.js';

/**
 * @param {{
 * user: ReturnType<typeof toUserRowModel>,
 * onRankChange: (id: number, type: string) => void
 * className?: string
 * }} props
 */
export const RankCell = ({ user, onRankChange, className }) => {
  if (!user.rank) {
    return (
      <TableCell className={cn(`w-40 ${className}`)}>
        <div className='h-9' />
      </TableCell>
    );
  }

  return (
    <TableCell className={cn(`w-40 ${className}`)}>
      <RankSelect
        value={user.rank}
        disabled={user.rank === 'FIRST_ADMIN'}
        onChange={(rank) => onRankChange(user.id, rank)}
      />
    </TableCell>
  );
};
