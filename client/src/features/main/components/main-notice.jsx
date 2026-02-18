// @ts-check
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// 모크
import { notices } from '../../notice/mocks/notice-mock';
import { ChevronRightIcon } from 'lucide-react';

/**
 * ✅ TODO: 백엔드 붙이면 여기만 진짜 API로 바꾸면 됨
 * - 예: GET /api/notices?size=5&page=0
 */
const fetchMainNotices = async () => {
  const res = await fetch(
    'http://localhost:8080/api/notice/list?size=5&page=1',
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  //console.log("mainNotices",res)

  if (!res.ok) throw new Error('공지사항 조회 실패');

  // 기대 형태(예시):
  // { items: [{ id, title, createdAt, isImportant }...] }
  // 또는 그냥 배열로 올 수도 있어서 아래에서 보정함
  return res.json();
};

const normalizeNotices = (data) => {
  console.log('normalize notice data:', data);
  if (!data) return [];

  // 1. 이미 배열이면 그대로 반환
  if (Array.isArray(data)) return data;

  // 2. pinned와 items가 둘 다 있을 수 있으므로 합치기
  let combined = [];

  if (Array.isArray(data.pinned)) {
    combined = [...combined, ...data.pinned];
  }

  if (Array.isArray(data.items)) {
    combined = [...combined, ...data.items];
  }

  // 3. 만약 위에서 아무것도 안 담겼는데 content(Page 응답)가 있다면
  if (combined.length === 0 && Array.isArray(data.content)) {
    return data.content;
  }

  return combined;
};

export const MainNotice = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['main', 'notices'],
    queryFn: fetchMainNotices,
  });

  const notices = useMemo(() => normalizeNotices(data).slice(0, 8), [data]);

  return (
    <section className='rounded-2xl border p-4 shadow-sm bg-card w-full'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>공지사항</h2>

        {/* '+' 버튼 -> 공지사항 목록 페이지 이동 */}
        <button
          type='button'
          onClick={() => navigate('/dashboard/notice')}
          className='inline-flex h-9 w-9 items-center justify-center rounded-xl border text-xl hover:bg-accent'
          aria-label='공지사항 목록으로 이동'
          title='공지사항 목록'
        >
          +
        </button>
      </div>

      {isLoading && (
        <div className='space-y-2'>
          <div className='h-10 w-full animate-pulse rounded-xl' />
          <div className='h-10 w-full animate-pulse rounded-xl' />
          <div className='h-10 w-full animate-pulse rounded-xl' />
        </div>
      )}

      {!isLoading && error && (
        <div className='rounded-xl border p-3 text-sm text-red-700'>
          공지사항을 불러오지 못했어요.
        </div>
      )}

      {!isLoading && !error && notices.length === 0 && (
        <div className='rounded-xl border p-3 text-sm text-gray-600'>
          등록된 공지사항이 없어요.
        </div>
      )}

      {!isLoading && !error && notices.length > 0 && (
        <ul className='space-y-2'>
          {notices.map((n) => (
            <li key={n.id}>
              {/* 항목 클릭 -> 게시글 확인 페이지 이동 */}
              <button
                type='button'
                onClick={() => navigate(`/dashboard/notice/${n.id}`)}
                className='flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left hover:bg-accent overflow-hidden'
              >
                <div className='flex-1 min-w-0 w-0'>
                  <div className='flex items-center gap-2'>
                    {n.pinned ? (
                      <span className='shrink-0 rounded-lg bg-primary px-2 py-0.5 text-xs font-medium text-red-50'>
                        중요
                      </span>
                    ) : null}

                    <p className='font-medium truncate'>
                      {n.title ?? '제목 없음'}
                    </p>
                  </div>

                  <p className='mt-0.5 text-xs text-gray-500'>
                    {n.createdAt ? String(n.createdAt).slice(0, 10) : ''}
                  </p>
                </div>

                <span className='ml-auto shrink-0 text-gray-400'>
                  <ChevronRightIcon />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
