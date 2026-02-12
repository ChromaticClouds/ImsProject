// @ts-check
import { useQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { getNotices } from '@/features/notice/api/noticeApi';
import { NoticeTable } from '@/features/notice/components/notice-table';

import { useSearchParams } from 'react-router-dom';
import { NoticeHeader } from '@/features/notice/components/notice-header';
import { NoticePagination } from '@/features/notice/components/notice-pagination';
import { NoticeSearch } from '@/features/notice/components/notice-search';

/**
 * 공지사항 목록 페이지
 * - 게시글 번호 / 제목 / 작성자 / 작성일 표시
 * - 관리자만 작성 버튼 활성화
 */
export const Notice = () => {
  const [params] = useSearchParams();

  const rawPage = Number(params.get('page'));
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const { data } = useQuery({
    queryKey: ['notices', page],
    queryFn: () => getNotices(page),
  });

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-6'>
      <Card>
        <NoticeHeader />

        <CardContent className='space-y-4'>
          {/* 검색 영역 */}
          <NoticeSearch />

          {/* 공지사항 목록 */}
          <NoticeTable data={data} />
        </CardContent>

        <CardFooter>
          <NoticePagination 
            currentPage={data?.page}
            totalPages={data?.totalPages}
          />
        </CardFooter>
      </Card>
    </div>
  );
};
