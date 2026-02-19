// @ts-check

/**
 * Components
 */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.js';
import { Button } from '@/components/ui/button.js';
import { Spinner } from '@/components/ui/spinner.js';

/**
 * Hooks
 */
import { usePoBulkRemoveMutation } from '@/features/purchase-order/hooks/use-po-bulk-remove-mutation.js';
import { useState } from 'react';

/** @param {{ orderNumber: string }} props */
export const PoDeleteDialog = ({ orderNumber }) => {
  const [open, setOpen] = useState(false);
  const { mutate: bulkRemove, isPending } = usePoBulkRemoveMutation();

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='text-destructive hover:text-destructive'
        >
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>발주서 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            선택한 발주서를 삭제하시겠습니까? 삭제하면 복구가 불가능합니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            variant='outline'
            className='text-destructive hover:text-destructive'
            onClick={(e) => {
              e.preventDefault();

              bulkRemove({ orderNumbers: [orderNumber] });
              setOpen(false);
            }}
          >
            {isPending ? <Spinner /> : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
