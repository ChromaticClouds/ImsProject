// @ts-check

/**
 * Components
 */
import { Badge } from '@/components/ui/badge.js';
import { CardContent } from '@/components/ui/card.js';
import { Spinner } from '@/components/ui/spinner.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';

/**
 * Hooks
 */
import { useGetUserGroup } from '../../hooks/use-get-user-group.js';
import { useUserGroupParams } from '../../hooks/use-user-group-params.js';
import { useMemo } from 'react';

/**
 * Utils
 */
import { toUserRowModel } from '../../schemas/user-model.js';

export const UserGroupList = () => {
  const { query } = useUserGroupParams();
  const { data, isFetching } = useGetUserGroup(query);

  const { content = [] } = data ?? {};

  const users = useMemo(() => content.map(toUserRowModel), [content]);

  return (
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>사용자명</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>직급</TableHead>
            <TableHead>역할</TableHead>
            <TableHead className="text-center">상태</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isFetching ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex w-full h-24 justify-center items-center gap-2">
                  <Spinner />
                  <span className="text-muted-foreground text-sm">
                    불러오는 중...
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell />
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.rankLabel}</TableCell>
                <TableCell>
                  {user.roleLabel}
                  {user.roleDescription && (
                    <span className="text-muted-foreground text-sm ml-1">
                      ({user.roleDescription})
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-primary text-white">
                    {user.statusLabel}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex w-full h-24 justify-center items-center">
                  <span className="text-muted-foreground">데이터가 없습니다.</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  );
};
