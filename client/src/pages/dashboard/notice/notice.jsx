// @ts-check
import { useQuery } from '@tanstack/react-query';

import { AppHeader } from '@/components/common/app-header.jsx';

import { getNotices } from '@/features/notice/api';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';
import { NoticeListView } from '@/features/notice/components/notice-list-view/notice-list-view';
// import { NoticeSearch } from '@/features/notice/components/notice-search'; 없애는 기능

/**
 * 공지사항 목록 페이지
 * - 게시글 번호 / 제목 / 작성자 / 작성일 표시
 * - 관리자만 작성 버튼 활성화
 */
export const Notice = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const rawPage = Number(params.get('page'));
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const searchValue = params.get('search') ?? '';

  const {
    data,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notices', page, searchValue],
    queryFn: () => getNotices(page, searchValue),
  });

  const canCreate = user?.userRank === 'FIRST_ADMIN';

  const movePage = (/** @type {number} */ nextPage) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set('page', String(nextPage));

    navigate(`/dashboard/notice?${nextParams.toString()}`);
  };

  return (
    <>
      <AppHeader
        title='공지사항'
        description='시스템 운영 및 재고관리 관련 공지사항을 확인하세요.'
      />

      <NoticeListView
        pinned={data?.pinned ?? []}
        items={data?.items ?? []}
        page={data?.page ?? page}
        totalPages={data?.totalPages ?? 1}
        searchValue={searchValue}
        isLoading={isLoading}
        isFetching={isFetching}
        error={isError ? '서버와 연결할 수 없습니다.' : false}
        canCreate={canCreate}
        onCreate={() => navigate('/dashboard/notice/create')}
        onSelectNotice={(noticeId) => navigate(`/dashboard/notice/${noticeId}`)}
        onPageChange={movePage}
        onRetry={() => refetch()}
      />
    </>
  );
};
