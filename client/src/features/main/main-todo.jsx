// @ts-check
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

/**
 * ✅ TODO: 백엔드 붙이면 여기만 실제 API로 변경
 * - 예: GET /api/todos/today?size=8
 * - 또는 GET /api/todos?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
const fetchTodayTodos = async () => {
  const res = await fetch('http://localhost:8080/api/todos/today?size=8', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error('금일 투두 조회 실패');
  return res.json();
};

const normalizeTodos = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.content)) return data.content;
  return [];
};

// 임시 모크
const MOCK_TODOS = [
  { id: 1, title: '금일 입고 확인', startDate: '2026-02-09', endDate: '2026-02-09', completed: false },
  { id: 2, title: '재고 실사 체크', startDate: '2026-02-09', endDate: '2026-02-09', completed: true },
];


export const MainTodo = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['main', 'todos', 'today'],
    queryFn: fetchTodayTodos,
  });

  const todos = useMemo(() => normalizeTodos(data).slice(0, 8), [data]);

  return (
    <></>
    // <section className="col-span-5 rounded-2xl border p-4 shadow-sm">
    //   <div className="mb-3 flex items-center justify-between">
    //     <h2 className="text-lg font-semibold">금일 업무 목록</h2>

    //     {/* 요구사항: '+' 버튼 -> 투두리스트 페이지 이동 */}
    //     <button
    //       type="button"
    //       onClick={() => navigate('/dashboard/todo')}
    //       className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-xl hover:bg-gray-100"
    //       aria-label="투두리스트로 이동"
    //       title="투두리스트"
    //     >
    //       +
    //     </button>
    //   </div>

    //   {isLoading && (
    //     <div className="space-y-2">
    //       <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
    //       <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
    //       <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
    //     </div>
    //   )}

    //   {!isLoading && error && (
    //     <div className="rounded-xl border p-3 text-sm text-red-700">
    //       투두리스트를 불러오지 못했어요.
    //     </div>
    //   )}

    //   {!isLoading && !error && todos.length === 0 && (
    //     <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-600">
    //       오늘 처리할 업무가 없어요.
    //     </div>
    //   )}

    //   {!isLoading && !error && todos.length > 0 && (
    //     <ul className="space-y-2">
    //       {todos.map((t) => (
    //         <li key={t.id}>
    //           <div className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 hover:bg-gray-50">
    //             <button
    //               type="button"
    //               onClick={() => navigate(`/dashboard/todo/${t.id}`)} // 요구사항: 상세로 이동
    //               className="min-w-0 flex-1 text-left"
    //               title="업무 상세"
    //             >
    //               <p className="truncate font-medium">
    //                 {t.title ?? '제목 없음'}
    //                 {t.completed ? (
    //                   <span className="ml-2 rounded-lg bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
    //                     완료
    //                   </span>
    //                 ) : null}
    //               </p>

    //               <p className="mt-0.5 text-xs text-gray-500">
    //                 {t.startDate ? String(t.startDate).slice(0, 10) : ''} ~{' '}
    //                 {t.endDate ? String(t.endDate).slice(0, 10) : ''}
    //               </p>
    //             </button>

    //             {/* 메인에서는 “요약”만: 실제 수정/삭제/완료는 투두 페이지에서 하게 유도 */}
    //             <button
    //               type="button"
    //               onClick={() => navigate('/dashboard/todo')}
    //               className="ml-3 shrink-0 rounded-xl border bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100"
    //             >
    //               관리
    //             </button>
    //           </div>
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </section>
  );
};
