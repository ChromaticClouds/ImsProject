import { Button } from '@/components/ui/button.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.js';
import { LogOutIcon } from 'lucide-react';

export const LogOutDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='justify-start text-destructive'
        >
          <LogOutIcon />
          <span>로그아웃</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그아웃</DialogTitle>
          <DialogDescription>정말로 로그아웃 하시겠습니까?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='destructive'>로그아웃</Button>
          <DialogClose asChild>
            <Button variant='secondary'>취소</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
