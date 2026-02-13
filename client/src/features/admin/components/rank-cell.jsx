// @ts-check

import { TableCell } from '@/components/ui/table.js';
import { RankSelect } from './rank-select.jsx';
import { toUserRowModel } from '../schemas/user-model.js';

/**
 * @param {{ 
 * user: ReturnType<typeof toUserRowModel>, 
 * onRankChange: (id: number, type: string) => void 
 * }} props
 */
export const RankCell = ({ user, onRankChange }) => {
  if (!user.rank) {
    return (
      <TableCell className='w-40'>
        <div className='h-9' />
      </TableCell>
    );
  }

  return (
    <TableCell className='w-40'>
      <RankSelect
        value={user.rank}
        disabled={user.rank === 'FIRST_ADMIN'}
        onChange={(rank) => onRankChange(user.id, rank)}
      />
    </TableCell>
  );
};
