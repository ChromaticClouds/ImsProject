// @ts-check

import { Button } from '@/components/ui/button';
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
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * @typedef {object} NoticeDetailActionsProps
 * @property {boolean} canManage
 * @property {boolean} isDeleting
 * @property {() => void} onDelete
 * @property {() => void} onEdit
 */

/**
 * @param {NoticeDetailActionsProps} props
 */
export const NoticeDetailActions = ({
  canManage,
  isDeleting,
  onDelete,
  onEdit,
}) => (
  <div className='flex shrink-0 flex-wrap items-center gap-2'>
    <Button
      variant='outline'
      disabled={!canManage}
      onClick={onEdit}
    >
      <PencilIcon
        className='size-4'
        aria-hidden='true'
      />
      수정
    </Button>

    <AlertDialog>
      <AlertDialogTrigger
        asChild
        disabled={!canManage || isDeleting}
      >
        <Button
          variant='outline'
          className='text-destructive hover:text-destructive'
          disabled={!canManage || isDeleting}
        >
          <TrashIcon
            className='size-4'
            aria-hidden='true'
          />
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            정말 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button className='text-muted-foreground'>취소</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            variant='outline'
          >
            <Button
              className='text-destructive hover:text-destructive'
              onClick={onDelete}
            >
              삭제
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);
