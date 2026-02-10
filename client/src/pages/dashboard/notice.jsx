// @ts-check

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Plus } from 'lucide-react';

import {Card,CardHeader,CardTitle,CardDescription,CardContent,CardFooter,} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { fetchNoticessssss } from '@/features/notice/api/noticeApi'; 
import { NoticeTable } from '@/features/notice/components/notice-table';

// 페이지네이션 나중에 하나로 선택 및 수정
import { NoticePagination } from '@/features/notice/components/notice-pagination'; 
import { useNoticePagination } from '@/features/notice/hooks/use-notice-pagination';

import { useNoticeSearch } from '@/features/notice/hooks/use-notice-search';
import { useNavigate } from 'react-router-dom';

/**
 * 공지사항 목록 페이지
 * - 게시글 번호 / 제목 / 작성자 / 작성일 표시
 * - 관리자만 작성 버튼 활성화
 */
export const Notice = () => {
  // 🔐 임시 권한 (나중에 로그인 정보로 교체)
  const isAdmin = true;

  const { data = [], error } = useQuery({
    queryKey: ['notices'],
    queryFn: fetchNoticessssss,
  });

  console.log(data, error);

  const search = useNoticeSearch();
  const searchedList = search.applySearch(data);
  const pagination = useNoticePagination(searchedList);

  const {
    paginatedList,
    currentPage,
    totalPages,
    setCurrentPage,
  } = pagination;

  const [selectedNotice, setSelectedNotice] = useState(null);
  const navigate = useNavigate();

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Bell className='w-5 h-5 text-primary' />
              공지사항
            </CardTitle>
            <CardDescription>
              시스템 운영 및 재고관리 관련 공지사항을 확인하세요.
            </CardDescription>
          </div>

          {/* 관리자만 작성 버튼 노출 */}

          {isAdmin && (
            <Button 
              size='sm' 
              className='gap-2'
              onClick={()=> navigate('/dashboard/notice/create')}
            >
              <Plus className='w-4 h-4' />
              작성
            </Button>
          )}
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* 검색 영역 */}
          <Input
            placeholder='제목 또는 작성자 검색'
            value={search.keyword}
            onChange={(e) => {
              search.setKeyword(e.target.value);
              setCurrentPage(1);
            }}
            className='w-64'
          />



          {/* 공지사항 목록 */}
          <NoticeTable
            notices={paginatedList}
            onSelect={(id) => navigate(`/dashboard/notice/${id}`)}
          />
        </CardContent>

        <CardFooter>
          <NoticePagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </CardFooter>
      </Card>


    </div>
  );
};
