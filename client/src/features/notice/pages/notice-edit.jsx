// @ts-check
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

import { NoticeForm } from '@/features/notice/components/notice-modify';
import { fetchNoticeById, updateNotice } from '@/features/notice/api/noticeApi';
import { useNoticeUpdateMutation } from '../hooks/use-notice-update-mutation';

export const NoticeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 게시글 수정 정보 불러오기
  const { data: notice, isLoading } = useQuery({
    queryKey: ['notice', id],
    queryFn: () => fetchNoticeById(id),
  });

  // 게시글 수정 처리 Fetcher
  const update = useNoticeUpdateMutation();

  if (isLoading) return <div className='p-6'>로딩중...</div>;
  if (!notice) return <div className='p-6'>게시글이 없습니다.</div>;

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>공지사항 수정</CardTitle>
          <CardDescription>내용을 수정하고 저장하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <NoticeForm
            mode='edit'
            initialValues={{
              title: notice.title,
              content: notice.content,
              pinned: notice.pinned,
              fileName: notice.fileName,
            }}
            onCancel={() => navigate(`/dashboard/notice/${id}`)}
            onSubmit={(formData) => update.mutate({ id: Number(id), formData })}
            isSubmitting={update.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};
