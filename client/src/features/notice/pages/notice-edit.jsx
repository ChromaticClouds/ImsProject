// @ts-check
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

import { NoticeForm } from '@/features/notice/components/notice-form';
import { fetchNoticeById, updateNotice } from '@/features/notice/api/noticeApi';

export const NoticeEdit = () => {
  const isAdmin = true;
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: notice, isLoading } = useQuery({
    queryKey: ['notice', id],
    queryFn: () => fetchNoticeById(id),
  });

  const save = useMutation({
    mutationFn: (values) => updateNotice(id, values),
    onSuccess: async (res) => {
      if (!res?.ok) {
        window.alert(res?.message ?? '수정 실패');
        return;
      }
      window.alert(res.message); // 수정되었습니다
      await qc.invalidateQueries({ queryKey: ['notices'] });
      await qc.invalidateQueries({ queryKey: ['notice', id] });
      navigate(`/dashboard/notice/${id}`);
    },
  });

  if (isLoading) return <div className='p-6'>로딩중...</div>;
  if (!notice) return <div className='p-6'>게시글이 없습니다.</div>;
  if (!isAdmin) return <div className='p-6'>권한이 없습니다.</div>;

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
            isAdmin={isAdmin}
            initialValues={{
              title: notice.title,
              content: notice.content,
              pinned: notice.pinned,
              fileName: notice.fileName,
            }}
            onCancel={() => navigate(`/dashboard/notice/${id}`)}
            onSubmit={(values) => save.mutate(values)}
            isSubmitting={save.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};
