// @ts-check

import { Button } from '@/components/ui/button.js';
import { useAdjustContext } from '../providers/adjust-provider.jsx';
import { Spinner } from '@/components/ui/spinner.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.js';
import { AdjustStatementList } from './adjust-statement-list.jsx';

export const AdjustStatementDialog = () => {
  const { form, products } = useAdjustContext();

  return (
    <Dialog>
      <DialogTrigger>
        <form.Subscribe selector={(s) => [s.canSubmit, s.isTouched]}>
          {([canSubmit, isTouched]) => (
            <div className='flex justify-end'>
              <Button
                className='w-24'
                disabled={!isTouched || !canSubmit}
              >
                조정 하기
              </Button>
            </div>
          )}
        </form.Subscribe>
      </DialogTrigger>
      <DialogContent className='min-w-4xl'>
        <DialogHeader>
          <DialogTitle>재고 조정 내역</DialogTitle>
          <DialogDescription>조정 내역을 확인해주세요</DialogDescription>
        </DialogHeader>

        <AdjustStatementList />

        <form.Subscribe selector={(s) => [s.isSubmitting]}>
          {([isSubmitting]) => (
            <div className='flex justify-end pt-4'>
              <Button
                className='w-28'
                onClick={form.handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner /> : '조정 완료'}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </DialogContent>
    </Dialog>
  );
};
