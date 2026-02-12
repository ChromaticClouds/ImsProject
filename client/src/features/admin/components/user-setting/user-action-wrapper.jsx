// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import { TableCell } from '@/components/ui/table.js';

import { toUserRowModel } from '../../schemas/user-model.js';
import { ConfirmButton } from './confirm-button.jsx';

const ActionCell = ({ children }) => (
  <TableCell className='w-24 h-16'>
    <div className='flex justify-center'>{children}</div>
  </TableCell>
);

/**
 * @typedef {object} ActionProps
 * @property {ReturnType<typeof toUserRowModel>} user
 * @property {(userId: number) => void} onLeave
 * @property {(userId: number) => void} onDelete
 * @property {(email: string) => void} onResend
 */

/**
 * @param {ActionProps} props
 */
export const UserActionsWrapper = ({ user, onLeave, onDelete, onResend }) => {
  const actions = [];

  if (user.status === 'PENDING') {
    actions.push(
      <ConfirmButton
        title='초대 이메일을 재발송하시겠습니까?'
        description='사용자에게 초대 메일이 다시 발송됩니다.'
        onConfirm={() => onResend(user.email)}
      >
        <Button>재발송</Button>
      </ConfirmButton>,
    );
    actions.push(
      <ConfirmButton
        title='사용자를 삭제하시겠습니까?'
        description='삭제된 사용자는 복구할 수 없습니다.'
        onConfirm={() => onDelete(user.id)}
        variant='destructive'
      >
        <Button
          variant='outline'
          className='text-destructive hover:text-destructive'
        >
          삭제
        </Button>
      </ConfirmButton>,
    );
  } else if (user.rank !== 'FIRST_ADMIN') {
    actions.push(
      <ConfirmButton
        title='해당 사용자를 퇴사 처리하시겠습니까?'
        description='사용자는 더 이상 시스템에 접근할 수 없습니다.'
        onConfirm={() => onLeave(user.id)}
      >
        <Button>퇴사</Button>
      </ConfirmButton>,
    );
    actions.push(
      <ConfirmButton
        title='사용자를 삭제하시겠습니까?'
        description='삭제된 사용자는 복구할 수 없습니다.'
        onConfirm={() => onDelete(user.id)}
        variant='destructive'
      >
        <Button
          variant='outline'
          className='text-destructive hover:text-destructive'
        >
          삭제
        </Button>
      </ConfirmButton>,
    );
  } else {
    actions.push(null, null);
  }

  return (
    <>
      <ActionCell>{actions[0]}</ActionCell>
      <ActionCell>{actions[1]}</ActionCell>
    </>
  );
};
