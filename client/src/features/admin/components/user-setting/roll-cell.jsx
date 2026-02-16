import { TableCell } from '@/components/ui/table.js';
import { RoleSelect } from './role-select.jsx';
import { toUserRowModel } from '../../schemas/user-model.js';
import { cn } from '@/lib/utils.js';

/**
 * @param {{
 * user: ReturnType<typeof toUserRowModel>,
 * onRoleChange (id: number, type: string) => void
 * className?: string
 * }} props
 */
export const RoleCell = ({ user, onRoleChange, className }) => (
  <TableCell className={cn(`w-40 ${className}`)}>
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
