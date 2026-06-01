// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { createNotice } from '@/features/notice/api/index.js';

export const useNoticeCreateMutation = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createNotice,

    onSuccess: async (res) => {
      if (res?.success === false) {
        throw new Error(res.message ?? '등록 실패');
      }

      toast.success(res?.message ?? '등록되었습니다.', {
        id: 'notice-create-success',
      });

      await qc.invalidateQueries({ queryKey: ['notices'] });
      navigate('/dashboard/notice');
    },

    onError: (err) => {
      toast.error(`등록 실패: ${err?.message ?? err}`, {
        id: 'notice-create-error',
      });
    },
  });
};
