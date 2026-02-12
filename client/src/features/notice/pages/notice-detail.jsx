// @ts-check
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import { fetchNoticeById, deleteNotice } from '@/features/notice/api/noticeApi';

export const NoticeDetail = () => {
  const isAdmin = true;
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: notice, isLoading } = useQuery({
    queryKey: ['notice', id],
    queryFn: () => fetchNoticeById(id),
  });

  const del = useMutation({
    mutationFn: () => deleteNotice(id),
    onSuccess: async (res) => {
      if (!res?.ok) {
        window.alert(res?.message ?? '삭제 실패');
        if(res?.success!=false) {
          navigate('/dashboard/notice');
        }
        return;
      }
      window.alert(res.message); // "삭제 완료 되었습니다."
      await qc.invalidateQueries({ queryKey: ['notices'] });
      await qc.invalidateQueries({ queryKey: ['notice', id] });
      
      navigate('/dashboard/notice');
    },
  });

  if (isLoading) return <div className='p-6'>로딩중...</div>;
  if (!notice) return <div className='p-6'>게시글이 없습니다.</div>;

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            {notice.pinned ? (
              <span className="shrink-0 rounded-lg bg-red-700 px-2 py-0.5 text-xs font-medium text-red-50">
                중요
              </span>
            ) : null}
            {notice.title}
          </CardTitle>
          <CardDescription>작성일: {notice.createdAt}</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div className='whitespace-pre-wrap text-sm'>{notice.content}</div>

          {notice.fileName && (
            <div className='text-sm'>
              첨부파일:&nbsp;
              <Button
                variant='link'
                className='p-0 h-auto'
                onClick={() => window.alert('(mock) 첨부파일 다운로드')}
              >
                {notice.fileName} 다운로드
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => navigate('/dashboard/notice')}>
            목록
          </Button>

          <Button
            variant='outline'
            disabled={!isAdmin}
            onClick={() => navigate(`/dashboard/notice/${id}/edit`)}
          >
            수정
          </Button>

          <Button
            variant='destructive'
            disabled={!isAdmin || del.isPending}
            onClick={() => {
              const ok = window.confirm('정말 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.');
              if (!ok) return;
              del.mutate();
              
            }}
          >
            {del.isPending ? '삭제중...' : '삭제'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
