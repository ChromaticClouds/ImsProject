// @ts-check

/**
 * Api
 */
import { deleteVendor } from '@/features/vendor/api/index.js';

/**
 * Hooks
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    /** @param {number} id */
    mutationFn: (id) => deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'], exact: false });
      queryClient.invalidateQueries({
        queryKey: ['vendorDetail'],
        exact: false,
      });
    },
  });
}
