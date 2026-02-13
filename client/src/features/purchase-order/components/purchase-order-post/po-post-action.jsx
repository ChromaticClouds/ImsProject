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
import { useNavigate } from 'react-router-dom';
import { usePoFormContext } from '../../providers/po-post-form-provder.jsx';
import { Spinner } from '@/components/ui/spinner.js';

export const PoPostAction = () => {
  const form = usePoFormContext();
  const navigate = useNavigate();

  return (
    <form.Subscribe
      selector={(s) => [s.isSubmitting, s.canSubmit, s.isTouched]}
    >
      {([isSubmitting, canSubmit, isTouched]) => (
        <div className='w-full flex justify-end gap-3 h-24'>
          <Button
            onClick={() => navigate('/dashboard/purchase-order')}
            variant='secondary'
          >
            목록으로
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={!canSubmit || !isTouched}
                type='button'
              >
                발주하기
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>발주서 등록</AlertDialogTitle>
                <AlertDialogDescription>
                  해당 발주서를 등록하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isSubmitting}
                  type='submit'
                  onClick={form.handleSubmit}
                >
                  {isSubmitting ? <Spinner /> : '등록'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </form.Subscribe>
  );
};
