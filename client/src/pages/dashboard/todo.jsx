// @ts-check
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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

import { fetchTodos } from '@/features/todo/api/todoApi';
import { TodoTable } from '@/features/todo/components/todo-table';
import { TodoPagination } from '@/features/todo/components/todo-pagination';
// import { TodoDetailDialog } from '@/features/todo/components/todo-dialog';

import { useTodoSearch } from '@/features/todo/hooks/todo-search';
import { useTodoPagination } from '@/features/todo/hooks/todo-pagination';
import {
  useTodoFilterSort,
  TODO_STATUS_LABEL,
  TODO_SORT_LABEL,
} from '@/features/todo/hooks/todo-filter-sort';
import { useNavigate } from 'react-router-dom';

export const Todo = () => {
  const { data = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // 목록 조작(삭제/완료)을 위해 로컬 상태로 복사
  const [localTodos, setLocalTodos] = useState([]);
  useEffect(() => {
    setLocalTodos(data);
  }, [data]);

  const search = useTodoSearch();
  const filterSort = useTodoFilterSort(localTodos);

  const searchedList = useMemo(() => {
    return search.applySearch(filterSort.filteredSortedList);
  }, [search, filterSort.filteredSortedList]);

  const pagination = useTodoPagination(searchedList);

  const { paginatedList, currentPage, totalPages, setCurrentPage } = pagination;

  const [selectedTodo, setSelectedTodo] = useState(null);

  const navigate = useNavigate();


  // actions
  const handleDelete = (id) => {
    const ok = window.confirm('정말 삭제할까요?');
    if (!ok) return;
    setLocalTodos((prev) => prev.filter((t) => t.id !== id));
    setCurrentPage(1);
  };

  // const handleComplete = (id) => {
  //   setLocalTodos((prev) =>
  //     prev.map((t) => (t.id === id ? { ...t, status: 'DONE' } : t))
  //   );
  // };

const today = new Date().toISOString().slice(0, 10);

const handleComplete = (id) => {
  setLocalTodos((prev) =>
    prev.map((t) => {
      if (t.id !== id) return t;

      const isDone = t.status === 'DONE';

      return {
        ...t,
        status: isDone ? 'IN_PROGRESS' : 'DONE',
        completedAt: isDone ? null : today,
      };
    })
  );
};



  const handleEdit = (id) => {
    // ✅ 일단 “수정 페이지로 이동”만 연결할 자리
    // 예) navigate(`/dashboard/todo/${id}/edit`)
    alert(`(예정) 업무 수정 페이지 이동: id=${id}`);
  };

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
                <Button variant='outline' size='sm' className='gap-2'>
                  <Filter className='w-4 h-4' /> {TODO_STATUS_LABEL[filterSort.status]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-40'>
                <DropdownMenuLabel>상태 필터</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(TODO_STATUS_LABEL).map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => {
                      filterSort.setStatus(key);
                      setCurrentPage(1);
                    }}
                  >
                    {TODO_STATUS_LABEL[key]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 정렬 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  {TODO_SORT_LABEL[filterSort.sort]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-44'>
                <DropdownMenuLabel>정렬</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(TODO_SORT_LABEL).map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => {
                      filterSort.setSort(key);
                      setCurrentPage(1);
                    }}
                  >
                    {TODO_SORT_LABEL[key]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 업무 등록 버튼 */}
            <Button size='sm' className='gap-2' onClick={handleCreate}>
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
                setCurrentPage(1);
              }}
              className='h-9 w-72'
            />
          </div>

          {/* 테이블 */}
          <TodoTable
            todos={paginatedList}
            onDetail={(todo) => navigate(`/dashboard/todo/${todo.id}`)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />

          <CardFooter>
            <TodoPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </CardFooter>
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
