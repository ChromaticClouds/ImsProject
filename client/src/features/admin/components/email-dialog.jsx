import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.js';
import { EmailForm } from './email-form.jsx';
import { Button } from '@/components/ui/button.js';

export const EmailDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>이메일 초대</Button>
      </DialogTrigger>
      <DialogContent className='w-max'>
        <DialogHeader>
          <DialogTitle>이메일 초대</DialogTitle>
          <DialogDescription>사원들의 이메일을 입력해주세요</DialogDescription>
        </DialogHeader>
        <EmailForm />
      </DialogContent>
    </Dialog>
  );
};
