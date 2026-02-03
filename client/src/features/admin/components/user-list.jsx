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

const COLUMN_COUNT = 7;

export const UserList = () => {
  const { users, isFetching } = useUserList();

  return (
    <Table>
      <UserTableHeader />
      <TableBody>
        {renderTableBody({ users, isFetching })}
      </TableBody>
    </Table>
  );
};

/* ---------- helpers ---------- */

const renderTableBody = ({ users, isFetching }) => {
  if (isFetching) return <UserSkeletonRows />;

  if (users.length === 0) {
    return <EmptyRow />;
  }

  return users.map((user) => (
    <UserRow key={user.id} user={user} />
  ));
};

/* ---------- components ---------- */

const UserTableHeader = () => (
  <TableHeader>
    <TableRow className="bg-border hover:bg-muted">
      <TableHead />
      <TableHead>이름</TableHead>
      <TableHead>이메일</TableHead>
      <TableHead>직급</TableHead>
      <TableHead>권한</TableHead>
      <TableHead>권한 설명</TableHead>
      <TableHead />
      <TableHead />
    </TableRow>
  </TableHeader>
);

const EmptyRow = () => (
  <TableRow>
    <TableCell
      colSpan={COLUMN_COUNT}
      className="h-24 text-center text-muted-foreground"
    >
      사용자 정보가 없습니다.
    </TableCell>
  </TableRow>
);
