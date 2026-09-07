// @ts-check

import { Button } from '@/components/ui/button.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.js';
import { FieldSeparator } from '@/components/ui/field.js';
import { Spinner } from '@/components/ui/spinner.js';
import 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @import { useVendorEditForm } from '@/features/vendor/hooks/vendor-edit/use-vendor-edit-form.js';
 */

/**
 * @param {{ form: ReturnType<typeof useVendorEditForm>}} props
 */
export const VendorEditAction = ({ form }) => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-3'>
      <FieldSeparator />
      <div className='w-full flex justify-end gap-3'>
        <Button
          type='button'
          variant='secondary'
          onClick={() => navigate(-1)}
        >
          뒤로
        </Button>
        <form.Subscribe selector={(s) => [s.isSubmitting, s.canSubmit]}>
          {([isSubmitting, canSubmit]) => {
            return (
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={!canSubmit || isSubmitting}>완료</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    해당 거래처를 수정 완료하시겠습니까?
                  </DialogTitle>
                  <DialogDescription>
                    수정하려는 항목이 제대로 기입되어 있는 지 확인 바랍니다.
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      disabled={isSubmitting}
                      onClick={form.handleSubmit}
                    >
                      {isSubmitting ? <Spinner /> : '완료'}
                    </Button>
                    <DialogClose asChild>
                      <Button variant='secondary'>취소</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            );
          }}
        </form.Subscribe>
      </div>
    </div>
  );
};
