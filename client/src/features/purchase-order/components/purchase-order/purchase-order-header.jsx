// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { PurchaseOrderBulkActions } from '@/features/purchase-order/components/purchase-order/purchase-order-bulk-action.jsx';

/**
 * Hooks
 */
import { usePurchaseOrderSelectionStore } from '@/features/purchase-order/stores/use-purchase-order-selection-store.js';
import { usePoParamStore } from '@/features/purchase-order/stores/use-po-param-store.js';
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
import { toast } from 'sonner';
import { usePoBulkRemoveMutation } from '../../hooks/use-po-bulk-remove-mutation.js';
import { Spinner } from '@/components/ui/spinner.js';

/**
 * @param {{ onReload?: () => Promise<any> }} props
 */
export const PurchaseOrderHeader = ({ onReload }) => {
  const view = usePoParamStore((s) => s.view);

  const { selectedOrderNumbers, clear } = usePurchaseOrderSelectionStore();
  const { mutate: bulkRemove, isPending } = usePoBulkRemoveMutation();

  const selectedCount = selectedOrderNumbers.length;
  const hasSelection = selectedCount > 0;

  return (
    <CardHeader className='border-b flex flex-col'>
      <div className='w-full flex justify-between'>
        {/* 제목 */}
        <div className='flex flex-col gap-3 overflow-hidden'>
          <CardTitle className='text-nowrap'>발주 목록</CardTitle>
          <CardDescription className='text-nowrap'>
            전송 전/전송 완료 발주 내역을 확인하세요
          </CardDescription>
        </div>

        {view === 'DRAFT' && (
          <div className='flex gap-4 items-center'>
            <div className='flex gap-3 items-center'>
              {/* 선택 상태 안내 */}
              <span className='text-xs text-muted-foreground'>
                {selectedCount === 0 && '선택된 항목이 없습니다'}
                {selectedCount === 1 && '1건 선택됨 · 단일 전송'}
                {selectedCount > 1 && `${selectedCount}건 선택됨 · 일괄 전송`}
              </span>

              <div className='flex items-center gap-2 py-1 rounded-md'>
                {/* 선택 전송 */}
                <PurchaseOrderBulkActions onReload={onReload} />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='outline'
                      disabled={!hasSelection}
                      className='text-destructive hover:text-destructive'
                    >
                      {isPending ? <Spinner /> : '선택 삭제'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>발주서 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        선택한 발주서를 삭제하시겠습니까? 삭제하면 복구가
                        불가능합니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        variant='outline'
                        className='text-destructive hover:text-destructive'
                        onClick={() => {
                          if (!selectedOrderNumbers.length) {
                            toast.warning('삭제할 항목을 선택해주세요.');
                            return;
                          }

                          bulkRemove({ orderNumbers: selectedOrderNumbers });
                          clear();
                        }}
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </CardHeader>
  );
};
