// @ts-check
import { useState } from 'react';

import { Button } from '@/components/ui/button.js';
import { SendIcon } from 'lucide-react';

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

import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';
import { toast } from 'sonner';

import { usePoBulkSendMutation } from '@/features/purchase-order/hooks/use-po-bulk-send-mutation.js';
import { Spinner } from '@/components/ui/spinner.js';

/**
 * @param {{ onReload?: () => Promise<any> }} props
 */
export const PurchaseOrderBulkActions = ({ onReload }) => {
  const { selectedOrderNumbers, clear } = usePurchaseOrderSelectionStore();
  const { mutateAsync, isPending } = usePoBulkSendMutation();

  const [open, setOpen] = useState(false);

  const n = selectedOrderNumbers.length;
  const hasSelection = n > 0;

  const onConfirmBulkSend = async () => {
    if (!hasSelection) {
      toast.warning('전송할 항목을 선택해주세요.');
      return;
    }

    try {
      await mutateAsync({ orderNumbers: selectedOrderNumbers });
      clear();
      setOpen(false);
    } catch {}
  };

  return (
    <div className='flex items-center gap-2'>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogTrigger asChild>
          <Button
            disabled={!hasSelection}
            className='gap-2'
            onClick={() => setOpen(true)}
          >
            <SendIcon className='w-4 h-4' />
            선택 전송
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>선택 전송</AlertDialogTitle>
            <AlertDialogDescription>
              선택된 {n}건의 발주서를 전송합니다. 계속할까요?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirmBulkSend();
              }}
              disabled={isPending}
            >
              {isPending ? <Spinner /> : '전송'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant='secondary'
        onClick={clear}
        disabled={!hasSelection || isPending}
      >
        선택 해제
      </Button>
    </div>
  );
};
