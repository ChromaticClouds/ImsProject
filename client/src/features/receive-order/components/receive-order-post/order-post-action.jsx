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
import { useOrderPostContext } from '@/features/receive-order/providers/receive-order-post-provider.jsx';
import { useNavigate } from 'react-router-dom';

export const OrderPostAction = () => {
  const navigate = useNavigate();
  const { form } = useOrderPostContext();

  return (
    <div className='w-full flex justify-end gap-3'>
      <Button
        variant='secondary'
        onClick={() => navigate('/dashboard/receive-order')}
      >
        목록으로
      </Button>
      <form.Subscribe
        selector={(s) => [s.isSubmitting, s.canSubmit, s.isTouched]}
      >
        {([isSubmitting, canSubmit, isTouched]) => (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!canSubmit || !isTouched}>작성 완료</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>주문서 등록</AlertDialogTitle>
                <AlertDialogDescription>
                  주문서를 등록하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='w-full md:w-16'>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  className='w-full md:w-16'
                  onClick={() => form.handleSubmit()}
                >
                  {isSubmitting ? <Spinner /> : '등록'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </form.Subscribe>
    </div>
  );
};
