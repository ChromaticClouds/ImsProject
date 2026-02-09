// @ts-check
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// 모크
import { notices } from '../notice/mocks/notice-mock'; 

/**
 * ✅ TODO: 백엔드 붙이면 여기만 진짜 API로 바꾸면 됨
 * - 예: GET /api/notices?size=5&page=0
 */
const fetchMainNotices = async () => {
  const res = await fetch('http://localhost:8080/api/notices?size=5&page=0', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error('공지사항 조회 실패');

  // 기대 형태(예시):
  // { items: [{ id, title, createdAt, isImportant }...] }
  // 또는 그냥 배열로 올 수도 있어서 아래에서 보정함
  return res.json();
};

const normalizeNotices = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.content)) return data.content; // page 응답 대응
  return [];
};

//임시 모크데이터
const MOCK_NOTICES = [
  { id: 1, title: '시스템 점검 안내', createdAt: '2026-02-09', isImportant: true },
  { id: 2, title: '발주 마감 시간 변경', createdAt: '2026-02-08', isImportant: false },
];

export const MainNotice = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['main', 'notices'],
    queryFn: fetchMainNotices,
  });

  const notices = useMemo(() => normalizeNotices(data).slice(0, 5), [data]);

  return (
    <section className="col-span-5 rounded-2xl border p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">공지사항</h2>

        {/* '+' 버튼 -> 공지사항 목록 페이지 이동 */}
        <button
          type="button"
          onClick={() => navigate('/dashboard/notice')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border  text-xl"
          aria-label="공지사항 목록으로 이동"
          title="공지사항 목록"
        >
          +
        </button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <div className="h-10 w-full animate-pulse rounded-xl" />
          <div className="h-10 w-full animate-pulse rounded-xl" />
          <div className="h-10 w-full animate-pulse rounded-xl" />
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border p-3 text-sm text-red-700">
          공지사항을 불러오지 못했어요.
        </div>
      )}

      {!isLoading && !error && notices.length === 0 && (
        <div className="rounded-xl border p-3 text-sm text-gray-600">
          등록된 공지사항이 없어요.
        </div>
      )}

      {!isLoading && !error && notices.length > 0 && (
        <ul className="space-y-2">
          {notices.map((n) => (
            <li key={n.id}>
              {/* 항목 클릭 -> 게시글 확인 페이지 이동 */}
              <button
                type="button"
                onClick={() => navigate(`/dashboard/notice/${n.id}`)}
                className="flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {n.isImportant ? (
                      <span className="shrink-0 rounded-lg bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                        중요
                      </span>
                    ) : null}

                    <p className="truncate font-medium">{n.title ?? '제목 없음'}</p>
                  </div>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {n.createdAt ? String(n.createdAt).slice(0, 10) : ''}
                  </p>
                </div>

                <span className="ml-3 shrink-0 text-gray-400">›</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
