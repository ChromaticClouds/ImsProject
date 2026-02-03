import { TableRow, TableCell } from '@/components/ui/table.js';
import { Button } from '@/components/ui/button.js';
import { toUserRowModel } from '../schemas/user-model.js';

/**
 * Row에서 사용할 액션을 "정의"하는 함수
 * 렌더링과 분리
 * @param {ReturnType<typeof toUserRowModel>} user
 */
export const getRowActions = (user) => {
  if (user.status === 'PENDING') {
    return [
      <Button key="resend">재발송</Button>,
      <Button key="delete" variant="destructive">삭제</Button>,
    ];
  }

  if (user.rank !== 'FIRST_ADMIN') {
    return [
      <Button key="leave">퇴사</Button>,
      <Button key="delete" variant="destructive">삭제</Button>,
    ];
  }

  return [null, null];
}

/**
 * @param {{ user: ReturnType<typeof toUserRowModel>}} props
 */
export const UserRow = ({ user }) => {
  const isPending = user.status === 'PENDING';

  const actions = getRowActions(user);

  return (
    <TableRow id={String(user.id)} className='h-16'>
      <TableCell />
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>

      {/* 직급 / 권한 / 설명 등 공통 표시 영역 */}
      <TableCell>{!isPending ? user.rankLabel : '-'}</TableCell>
      <TableCell>{!isPending ? user.roleLabel : '-'}</TableCell>
      <TableCell>{!isPending ? user.roleDescription : '-'}</TableCell>

      {/* 액션 영역 (항상 2칸 고정) */}
      <TableCell>{actions[0]}</TableCell>
      <TableCell>{actions[1]}</TableCell>
    </TableRow>
  );
};
