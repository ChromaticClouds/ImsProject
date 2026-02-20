// @ts-check

/**
 * Components
 */
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
import { Spinner } from '@/components/ui/spinner.js';

/**
 * @typedef {object} TotalType
 * @property {number} n - 총 품목 수
 * @property {number} m - 총 품목 입고량
 * @property {number} amount - 총 품목 가격
 * @property {number} changed
 */

/**
 * @param {{ totals: TotalType, submitDisabled: boolean, submitting: boolean, handleComplete: () => void }} props
 */
export const IbRegisterDialog = ({
  totals,
  submitDisabled,
  submitting,
  handleComplete,
}) => {
  return (
    <Dialog>
      <DialogTrigger
        className='w-full'
        asChild
      >
        <Button
          className='w-full text-base'
          disabled={submitDisabled}
        >
          입고 완료
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>입고 등록</DialogTitle>
          <DialogDescription>
            총 {totals.n}종, {totals.m}개의 제품을 입고 확정하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>취소</Button>
          </DialogClose>
          <Button onClick={handleComplete}>
            {submitting ? <Spinner /> : '입고 확정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
