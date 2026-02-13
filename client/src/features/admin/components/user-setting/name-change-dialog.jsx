// @ts-check

import * as React from 'react';

/**
 * Components
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';
import { TableCell } from '@/components/ui/table.js';
import { UserIcon, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';

import { toUserRowModel } from '../../schemas/user-model.js';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * @param {{
 *  user: ReturnType<typeof toUserRowModel>,
 *  onNameChange: (userId: number, name: string) => void
 * }} props
 */
export const NameChangeDialog = ({ user, onNameChange }) => {
  const inputRef = React.useRef(null);

  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    const newName = inputRef.current?.value.trim();

    if (!newName || newName === user.name)
      return toast.error('이름을 입력해주세요');

    onNameChange(user.id, newName);
  };

  return (
    <TableCell>
      <div className='flex gap-2 items-center'>
        <span>{user.name}</span>

        <Dialog
          open={open}
          onOpenChange={(o) => setOpen(o)}
        >
          <DialogTrigger asChild>
            <PencilIcon
              size={16}
              className='text-input cursor-pointer'
            />
          </DialogTrigger>

          <DialogContent className='w-sm'>
            <DialogTitle>사용자 이름 변경</DialogTitle>
            <DialogDescription>
              변경할 사용자의 이름을 입력해주세요.
            </DialogDescription>

            <InputGroup>
              <InputGroupInput
                ref={inputRef}
                defaultValue={user.name}
              />
              <InputGroupAddon>
                <UserIcon />
              </InputGroupAddon>
            </InputGroup>

            <Button onClick={handleSubmit}>변경 완료</Button>
          </DialogContent>
        </Dialog>
      </div>
    </TableCell>
  );
};
