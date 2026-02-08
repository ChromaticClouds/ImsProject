// @ts-check
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TodoForm } from '@/features/todo/components/todo-form';

export const TodoCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    console.log('등록 데이터', values);
    alert('업무가 등록되었습니다 (mock)');
    navigate('/dashboard/todo');
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>업무 등록</CardTitle>
          <CardDescription>
            새로운 업무를 등록하고 기간과 태그를 설정하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TodoForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard/todo')}
          />
        </CardContent>
      </Card>
    </div>
  );
};
