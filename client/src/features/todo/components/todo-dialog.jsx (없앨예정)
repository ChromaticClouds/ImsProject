import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const STATUS_TEXT = {
  TODO: '미완료',
  IN_PROGRESS: '진행중',
  DONE: '완료',
};

export const TodoDetailDialog = ({ todo, onClose, onComplete }) => {
  if (!todo) return null;

  const tages = Array.isArray(todo.tages) ? todo.tages : [];

  return (
    <Dialog open={!!todo} onOpenChange={onClose}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{todo.title}</DialogTitle>
        </DialogHeader>

        <div className='text-sm text-muted-foreground'>
          작성자: {todo.userId} | 등록일: {todo.createdAt}
        </div>

        <div className='text-sm'>
          업무 기간: {todo.startDate} ~ {todo.endDate}
        </div>

        <div className='text-sm'>
          상태: <Badge variant='secondary'>{STATUS_TEXT[todo.status] ?? todo.status}</Badge>
        </div>

        {tages.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {tages.map((tag) => (
              <Badge key={tag} variant='outline'>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className='whitespace-pre-wrap text-sm'>{todo.description}</div>

        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='outline' onClick={onClose}>
            닫기
          </Button>

          {todo.status !== 'DONE' && (
            <Button
              onClick={() => {
                onComplete?.(todo.id);
                onClose?.();
              }}
            >
              완료 처리
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
