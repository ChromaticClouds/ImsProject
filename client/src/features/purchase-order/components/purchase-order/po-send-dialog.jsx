// @ts-check

import { Button } from '@/components/ui/button.js';
import { Badge } from '@/components/ui/badge.js';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog.js';
import { SendIcon, Building2, Hash, Calendar, Package } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner.js';
import { useState } from 'react';
import { usePoSendMutation } from '@/features/purchase-order/hooks/use-po-send-mutation.js';

/**
 * @param {{ content: OrderRequest, onConfirm?: (orderNumber: string) => void, loading?: boolean }} props
 */
export const PoSendDialog = ({ content }) => {
  const [open, setOpen] = useState(false);
  const send = usePoSendMutation();

  const orderNumber = content?.orderNumber ?? '-';

  const itemKinds = content?.itemKinds ?? 0;
  const totalCount = content?.totalCount ?? 0;

  const onConfirm = async () => {
    if (!orderNumber) return;

    const res = await send.mutateAsync(orderNumber).catch(() => null);
    if (res?.success !== false) setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='gap-2'
        >
          <SendIcon />
          전송
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-130'>
        <DialogHeader>
          <DialogTitle>발주서 전송</DialogTitle>
          <DialogDescription>
            아래 내용을 확인한 후 전송을 진행하세요.
          </DialogDescription>
        </DialogHeader>

        {/* Summary Card */}
        <div className='rounded-xl border bg-muted/30 p-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge
              variant='outline'
              className='gap-1'
            >
              <Package className='h-3.5 w-3.5' />
              품목 {itemKinds}개
            </Badge>
            <Badge variant='outline'>
              총 수량 {Number(totalCount).toLocaleString()}
            </Badge>
          </div>

          <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <InfoRow
              icon={<Building2 className='h-4 w-4' />}
              label='공급처'
              value={content?.vendorName ?? '-'}
            />
            <InfoRow
              icon={<Hash className='h-4 w-4' />}
              label='발주번호'
              value={content?.orderNumber ?? '-'}
              mono
            />
            <InfoRow
              icon={<Calendar className='h-4 w-4' />}
              label='발주일'
              value={content?.orderDate ?? '-'}
            />
            <InfoRow
              icon={<Calendar className='h-4 w-4' />}
              label='납기일'
              value={content?.recieveDate ?? '-'}
            />
          </div>
        </div>

        <div className='text-xs text-muted-foreground'>
          전송 후에는 공급처로 발주서가 이메일로 전달됩니다.
        </div>

        <DialogFooter className='gap-2 sm:gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>취소</Button>
          </DialogClose>

          <Button
            type='button'
            className='gap-2'
            onClick={onConfirm}
            disabled={send.isPending || orderNumber === '-'}
          >
            {send.isPending ? <Spinner /> : '전송'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * @param {{ icon: React.ReactNode, label: string, value: any, mono?: boolean }} props
 */
const InfoRow = ({ icon, label, value, mono = false }) => {
  return (
    <div className='flex items-start gap-3 rounded-lg bg-background p-3'>
      <div className='mt-0.5 text-muted-foreground'>{icon}</div>
      <div className='min-w-0'>
        <div className='text-xs text-muted-foreground'>{label}</div>
        <div
          className={
            'truncate text-sm font-medium ' + (mono ? 'font-mono' : '')
          }
          title={String(value ?? '')}
        >
          {value ?? '-'}
        </div>
      </div>
    </div>
  );
};
