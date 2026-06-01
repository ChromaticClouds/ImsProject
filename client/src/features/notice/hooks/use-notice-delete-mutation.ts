import { deleteNotice } from '@/features/notice/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useNoticeDeleteMutation = (id?: string) => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => deleteNotice(id),

    onSuccess: async (res) => {
      if (res?.success === false)
        return toast.error(
          res?.message ?? '삭제에 실패했습니다. 다시 시도해주세요.',
        );

      toast.success(res?.message);

      await qc.invalidateQueries({ queryKey: ['notice'] });
      await qc.invalidateQueries({ queryKey: ['notice', id] });
      navigate('/dashboard/notice');
    },
  });
};
