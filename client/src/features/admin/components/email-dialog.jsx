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
        <Button className='ml-auto'>사용자 초대</Button>
      </DialogTrigger>
      <DialogContent className='w-max'>
        <DialogHeader>
          <DialogTitle>사용자 초대</DialogTitle>
          <DialogDescription>
            이메일을 입력하여 사용자를 초대하세요.
          </DialogDescription>
        </DialogHeader>
        <EmailForm />
      </DialogContent>
    </Dialog>
  );
};
