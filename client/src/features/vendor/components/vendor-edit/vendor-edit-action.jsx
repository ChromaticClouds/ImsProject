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
        <form.Subscribe
          selector={(s) => ({
            isSubmitting: s.isSubmitting,
            canSubmit: s.canSubmit,
            values: s.values,
          })}
        >
          {({ isSubmitting, canSubmit, values }) => {
            const supplierHasNoItems =
              values.type === 'Supplier' && values.items.length === 0;
            const supplierHasInvalidPrice =
              values.type === 'Supplier' &&
              values.items.some(
                (item) =>
                  !Number.isFinite(item.purchasePrice) ||
                  item.purchasePrice <= 0,
              );
            const disabledReason = supplierHasNoItems
              ? '공급처는 품목을 1개 이상 등록해야 합니다.'
              : supplierHasInvalidPrice
                ? '모든 품목의 구매 단가를 1원 이상 입력해 주세요.'
                : '필수 입력값과 입력 형식을 확인해 주세요.';

            return (
              <div className='flex flex-col items-end gap-1.5'>
                {!canSubmit && (
                  <p className='text-xs text-destructive'>{disabledReason}</p>
                )}
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
              </div>
            );
          }}
        </form.Subscribe>
      </div>
    </div>
  );
};
