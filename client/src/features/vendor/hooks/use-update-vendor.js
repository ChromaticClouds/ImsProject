// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVendor } from '@/services/api';

/**
 * @typedef {{ id: number, payload: any }} UpdateVendorVars
 */

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * @param {UpdateVendorVars} vars
     */
    mutationFn: ({ id, payload }) => updateVendor(id, payload),

    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-detail', vars.id] });
      queryClient.refetchQueries({ queryKey: ['vendor-detail', vars.id]});
    },
  });
}

