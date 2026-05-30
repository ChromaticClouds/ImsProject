import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.js';
import { DialogClose } from '@radix-ui/react-dialog';
import { Spinner } from '@/components/ui/spinner.js';

export function VendorCreateActionsCard({
  canSubmit,
  isPending,
  onCancel,
}) {
  return (
    <div className='rounded-2xl border bg-secondary p-4'>
      <div className='mb-2 text-sm font-semibold'>저장</div>
      <div className='text-xs text-muted-foreground'>
        필수 항목을 확인한 뒤 완료를 눌러 저장하세요.
      </div>

      <div className='mt-3 grid gap-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              id='vendor-create-submit'
              type='button'
              disabled={!canSubmit}
              className='w-full'
            >
              완료
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>거래처 등록</DialogTitle>
              <DialogDescription>
                거래처를 등록하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type='button'
                  variant='outline'
                >
                  취소
                </Button>
              </DialogClose>
              <Button
                type='submit'
                form='vendor-create-form'
              >
                {isPending ? <Spinner /> : '완료'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isPending}
          className='w-full'
        >
          취소
        </Button>
      </div>
    </div>
  );
}
