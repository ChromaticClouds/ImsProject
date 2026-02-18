// @ts-check

import { Badge } from '@/components/ui/badge.js';
import { CardContent } from '@/components/ui/card.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.js';
import { useUserList } from '@/features/admin/providers/user-provider.jsx';

export const UserGroupList = () => {
  const { users } = useUserList();

  return (
    <CardContent className='p-0'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>사용자명</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>직급</TableHead>
            <TableHead>역할</TableHead>
            <TableHead className='text-center'>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell />
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.rankLabel}</TableCell>
              <TableCell>
                {user.roleLabel}
                {user.roleDescription && (
                  <span className='text-muted-foreground text-sm ml-1'>
                    ({user.roleDescription})
                  </span>
                )}
              </TableCell>
              <TableCell className='text-center'>
                <Badge
                  className='bg-primary text-white'
                >
                  {user.statusLabel}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  );
};
