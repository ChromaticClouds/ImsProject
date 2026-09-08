// @ts-check
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { LoadingState } from '@/components/common/loading-state.jsx';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import {
  deleteTodo,
  fetchTodoById,
  toggleTodoStatus,
} from '@/features/todo/api/todoApi';

const STATUS_LABEL = {
  IN_ACTIVE: '진행중',
  COMPLETE: '완료',
};

/**
 * @param {string | undefined} id
 * @returns {string}
 */
const requireTodoId = (id) => {
  if (!id) throw new Error('Todo ID가 필요합니다.');
  return id;
};

export const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: todo, isLoading } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodoById(requireTodoId(id)),
    enabled: Boolean(id),
  });

  const del = useMutation({
    mutationFn: () => deleteTodo(requireTodoId(id)),
    onSuccess: async (res) => {
      if (!res?.ok) {
        window.alert(res?.message ?? '삭제 실패');
        return;
      }
      window.alert(res.message ?? '삭제 완료');
      await qc.invalidateQueries({ queryKey: ['todos'] });
      await qc.invalidateQueries({ queryKey: ['todo', id] });
      navigate('/dashboard/todo');
    },
  });

  const done = useMutation({
    mutationFn: () => toggleTodoStatus(requireTodoId(id)),
    onSuccess: async (res) => {
      if (!res?.ok) {
        window.alert(res?.message ?? '처리 실패');
        return;
      }
      window.alert(res.message ?? '완료 처리되었습니다');
      await qc.invalidateQueries({ queryKey: ['todos'] });
      await qc.invalidateQueries({ queryKey: ['todo', id] });
    },
  });

  if (isLoading)
    return <LoadingState variant='page' label='업무를 불러오는 중입니다.' />;
  if (!todo) return <div className='p-6'>업무가 없습니다.</div>;

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            {todo.status && <Badge>{STATUS_LABEL[todo.status] ?? todo.status}</Badge>}
            {todo.title}
          </CardTitle>
          <CardDescription>
            생성일: {todo.createdAt} · 기간: {todo.startDate} ~ {todo.endDate}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* 설명 */}
          <div className='text-sm whitespace-pre-wrap'>
            {todo.description || '(설명 없음)'}
          </div>

          {/* 태그 */}
          <div className='flex gap-2 flex-wrap'>
            {todo.tags.map((tag) => (
              <Badge key={tag} variant='secondary'>
                {tag}
              </Badge>
            ))}
            {todo.tags.length === 0 && (
              <div className='text-sm text-muted-foreground'>태그 없음</div>
            )}
          </div>

          {/* 완료일 추가 */}
          <div>
            {todo.status === 'COMPLETE' && (
              <div className='text-sm text-muted-foreground'>완료됨</div>
            )}
          </div>
        </CardContent>

        <CardFooter className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => navigate('/dashboard/todo')}>
            목록
          </Button>

          <Button
            variant='outline'
            onClick={() => navigate(`/dashboard/todo/${id}/edit`)}
          >
            수정
          </Button>

          <Button
            variant='secondary'
            disabled={todo.status === 'COMPLETE' || done.isPending}
            onClick={() => done.mutate()}
          >
            완료
          </Button>

          <Button
            variant='destructive'
            disabled={del.isPending}
            onClick={() => {
              const ok = window.confirm('정말 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.');
              if (!ok) return;
              del.mutate();
            }}
          >
            삭제
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
