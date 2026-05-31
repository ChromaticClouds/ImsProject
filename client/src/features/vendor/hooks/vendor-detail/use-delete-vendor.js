// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteVendor } from '@/features/vendor/api/index.js';
import { toast } from 'sonner';

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /** @param {number} id */
    mutationFn: (id) => deleteVendor(id),

    onSuccess: () => {
      toast.success('거래처가 삭제되었습니다.');

      queryClient.invalidateQueries({
        queryKey: ['vendors'],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ['vendorDetail'],
        exact: false,
      });
    },

    onError: (error) => {
      console.error(error);
      toast.error('거래처 삭제에 실패했습니다.');
    },
  });
};
