// @ts-check
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

import { TodoForm } from '@/features/todo/components/todo-form';
import { fetchTodoById, updateTodo } from '@/features/todo/api/todoApi';

export const TodoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: todo, isLoading } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodoById(id),
  });

  const save = useMutation({
    mutationFn: (values) => updateTodo(id, values),
    onSuccess: async (res) => {
      if (!res?.ok) {
        window.alert(res?.message ?? '수정 실패');
        return;
      }
      window.alert(res.message ?? '수정되었습니다');
      await qc.invalidateQueries({ queryKey: ['todos'] });
      await qc.invalidateQueries({ queryKey: ['todo', id] });
      navigate(`/dashboard/todo/${id}`);
    },
  });

  if (isLoading) return <div className='p-6'>로딩중...</div>;
  if (!todo) return <div className='p-6'>업무가 없습니다.</div>;

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>업무 수정</CardTitle>
          <CardDescription>업무 정보를 수정하고 저장하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <TodoForm
            mode='edit'
            initialValues={{
              title: todo.title,
              description: todo.description,
              category: todo.category,
              startDate: todo.startDate,
              endDate: todo.endDate,
              tages: todo.tages ?? [],
            }}
            onCancel={() => navigate(`/dashboard/todo/${id}`)}
            onSubmit={(values) => save.mutate(values)}
            isSubmitting={save.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};
