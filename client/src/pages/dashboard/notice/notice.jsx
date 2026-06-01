// @ts-check
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/common/app-header.jsx';

import { getNotices } from '@/features/notice/api';
import { NoticeTable } from '@/features/notice/components/notice-table';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { NoticePagination } from '@/features/notice/components/notice-pagination';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';
import { PlusIcon } from 'lucide-react';
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

  const { data } = useQuery({
    queryKey: ['notices', page],
    queryFn: () => getNotices(page),
  });

  return (
    <>
      <AppHeader
        title='공지사항'
        description='시스템 운영 및 재고관리 관련 공지사항을 확인하세요.'
        asideDecoration={
          <Button
            size='sm'
            className='gap-2'
            disabled={user?.userRank !== 'FIRST_ADMIN'}
            onClick={() => navigate('/dashboard/notice/create')}
          >
            <PlusIcon className='w-4 h-4' />
            작성
          </Button>
        }
      />

      <Card>
        <CardContent className='space-y-4 p-0'>
          <NoticeTable data={data} />
        </CardContent>

        <CardFooter>
          <NoticePagination
            currentPage={data?.page}
            totalPages={data?.totalPages}
          />
        </CardFooter>
      </Card>
    </>
  );
};
