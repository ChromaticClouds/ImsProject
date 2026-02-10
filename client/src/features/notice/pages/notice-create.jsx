// @ts-check
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

import { NoticeForm } from '@/features/notice/components/notice-form';
import { createNotice } from '@/features/notice/api/noticeApi';

export const NoticeCreate = () => {
  const isAdmin = true;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: (values) =>
      
      createNotice({
       userId: 1,
        ...values,
      }),

      // createNotice(values),     //--> 로그인 정보 받아오면 이걸로 바꾸기

    
    onSuccess: async (res) => {
      if (!res?.ok) {
        console.error('createNotice failed response:', res);
        window.alert(res?.message ?? '등록 실패');
        return;
      }

      window.alert(res.message ?? '등록되었습니다');

      await qc.invalidateQueries({ queryKey: ['notices'] });

     
      navigate('/dashboard/notice');
    },

  
  });

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>공지사항 작성</CardTitle>
          <CardDescription>제목/내용을 입력하고 등록하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <NoticeForm
            mode='create'
            isAdmin={isAdmin}
            onCancel={() => navigate('/dashboard/notice')}
            onSubmit={(values) => create.mutate(values)}
            isSubmitting={create.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};
