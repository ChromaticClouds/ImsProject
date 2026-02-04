// @ts-check

/**
 * Components
 */
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table.js';
import { UserRow } from './user-row.jsx';
import { UserSkeletonRows } from '@/features/admin/components/user-skeleton-rows.jsx';

/**
 * Hooks
 */
import { useUserList } from './user-provider.jsx';
import { usePatchUser } from '../hooks/use-patch-user.js';

/**
 * Constants
 */

const COLUMN_COUNT = 9;

export const UserList = () => {
  const { users, isFetching } = useUserList();
  const { mutate } = usePatchUser();

  /** @param {number} userId @param {string} rank */
  const handleRankChange = (userId, rank) => {
    mutate({ id: userId, body: { rank } });
  };

  /** @param {number} userId @param {string} role */
  const handleRoleChange = (userId, role) => {
    mutate({ id: userId, body: { role } });
  };

  /** @param {number} userId */
  const handleResend = (userId) => {
    console.log(userId);
  };

  /** @param {number} userId */
  const handleLeave = (userId) => {
    mutate({ id: userId, body: { status: 'INACTIVE' } });
  };

  /** @param {number} userId */
  const handleDelete = (userId) => {
    mutate({ id: userId, body: { status: 'DELETED' } });
  };

  return (
    <Table>
      <UserTableHeader />
      <TableBody>
        {renderTableBody({
          users,
          isFetching,
          onRankChange: handleRankChange,
          onRoleChange: handleRoleChange,
          onResend: handleResend,
          onLeave: handleLeave,
          onDelete: handleDelete,
        })}
      </TableBody>
    </Table>
  );
};

/* ---------- helpers ---------- */

const renderTableBody = ({
  users,
  isFetching,
  onRankChange,
  onRoleChange,
  onResend,
  onLeave,
  onDelete,
}) => {
  if (isFetching) return <UserSkeletonRows />;

  if (users.length === 0) {
    return <EmptyRow />;
  }

  return users.map((user) => (
    <UserRow
      key={user.id}
      user={user}
      onRankChange={onRankChange}
      onRoleChange={onRoleChange}
      onResend={onResend}
      onLeave={onLeave}
      onDelete={onDelete}
    />
  ));
};

/* ---------- components ---------- */

const HEAD_NAMES = [
  '',
  '이름',
  '이메일',
  '직급',
  '담당',
  '권한 설명',
  '상태',
  '',
  '',
];

const UserTableHeader = () => (
  <TableHeader>
    <TableRow className='bg-border hover:bg-muted'>
      {Array.from({ length: COLUMN_COUNT }, (_, i) => (
        <TableHead key={i} className='text-center'>{HEAD_NAMES[i]}</TableHead>
      ))}
    </TableRow>
  </TableHeader>
);

const EmptyRow = () => (
  <TableRow>
    <TableCell
      colSpan={COLUMN_COUNT}
      className='h-24 text-center text-muted-foreground'
    >
      사용자 정보가 없습니다.
    </TableCell>
  </TableRow>
);
