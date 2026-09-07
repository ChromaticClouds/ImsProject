// @ts-check
import { CalendarIcon, Filter, Plus } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// import { TodoDetailDialog } from '@/features/todo/components/todo-dialog';

import { useTodoSearch } from '@/features/todo/hooks/todo-search';

import {
  TODO_STATUS_LABEL,
  TODO_SORT_LABEL,
} from '@/features/todo/hooks/todo-filter-sort';
import { useNavigate } from 'react-router-dom';

export const Todo = () => {
  const search = useTodoSearch();

  const navigate = useNavigate();

  // const handleComplete = (id) => {
  //   setLocalTodos((prev) =>
  //     prev.map((t) => (t.id === id ? { ...t, status: 'DONE' } : t))
  //   );
  // };

  const handleCreate = () => {
    navigate('/dashboard/todo/create');
  };

  return (
    <div className='p-6 max-w-6xl mx-auto space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7'>
          <div>
            <CardTitle className='text-xl font-bold flex items-center gap-2'>
              <CalendarIcon className='w-5 h-5 text-primary' />
              투두리스트
            </CardTitle>
            <CardDescription>
              업무 목록을 확인하고 완료/진행 상태로 관리할 수 있습니다.
            </CardDescription>
          </div>

          <div className='flex gap-2'>
            {/* 필터 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-2'
                >
                  <Filter className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-40'
              >
                <DropdownMenuLabel>상태 필터</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(TODO_STATUS_LABEL).map(([key, label]) => (
                  <DropdownMenuItem key={key}>{label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 정렬 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* <Button variant='outline' size='sm'>
                  {TODO_SORT_LABEL[filterSort.sort]}
                </Button> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-44'
              >
                <DropdownMenuLabel>정렬</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(TODO_SORT_LABEL).map(([key, label]) => (
                  <DropdownMenuItem key={key}>{label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 업무 등록 버튼 */}
            <Button
              size='sm'
              className='gap-2'
              onClick={handleCreate}
            >
              <Plus className='w-4 h-4' /> 업무 등록
            </Button>
          </div>
        </CardHeader>

        <CardContent className='flex flex-col gap-4'>
          {/* 검색 */}
          <div className='flex items-center gap-2'>
            <Input
              placeholder='제목 / 설명 / 태그 검색'
              value={search.keyword}
              onChange={(e) => {
                search.setKeyword(e.target.value);
              }}
              className='h-9 w-72'
            />
          </div>

          <CardFooter></CardFooter>
        </CardContent>
      </Card>

      {/* 상세 다이얼로그 */}
      {/* <TodoDetailDialog
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
        onComplete={handleComplete}
      /> */}
    </div>
  );
};
