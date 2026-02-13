import { TableCell } from '@/components/ui/table.js';
import { RoleSelect } from './role-select.jsx';
import { toUserRowModel } from '../schemas/user-model.js';

/**
 * @param {{
 * user: ReturnType<typeof toUserRowModel>,
 * onRoleChange (id: number, type: string) => void
 * }} props
 */
export const RoleCell = ({ user, onRoleChange }) => (
  <TableCell className='w-40'>
    {user.rank === 'EMPLOYEE' ? (
      <RoleSelect
        value={user.role}
        onChange={(role) => onRoleChange(user.id, role)}
      />
    ) : (
      <div className='h-9' />
    )}
  </TableCell>
);
