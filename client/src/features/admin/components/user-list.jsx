// @ts-check
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table.js';
import { useUserList } from './user-provider.jsx';
import { UserRow } from './user-row.jsx';

export const UserList = () => {
  const { users } = useUserList();

  return (
    <Table>
      <TableHeader>
        <TableRow className='bg-border hover:bg-muted'>
          <TableHead className='px-8'>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>직급</TableHead>
          <TableHead>권한</TableHead>
          <TableHead>권한 설명</TableHead>
          <TableHead />
          <TableHead />
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.length === 0 ? (
          <EmptyRow />
        ) : (
          users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))
        )}
      </TableBody>
    </Table>
  );
};

const EmptyRow = () => (
  <TableRow>
    <TableCell
      colSpan={7}
      className="h-24 text-center text-muted-foreground"
    >
      사용자 정보가 없습니다.
    </TableCell>
  </TableRow>
);
