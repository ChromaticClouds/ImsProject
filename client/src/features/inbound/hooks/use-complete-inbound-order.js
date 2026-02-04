// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeInboundOrder } from '@/services/api';

/**
 * @returns {import('@tanstack/react-query').UseMutationResult<any, Error, number, unknown>}
 */
export function useCompleteInboundOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: completeInboundOrder,
    onSuccess: async () => {
      
      await qc.invalidateQueries({ queryKey: ['inbound-pending-summary'] });
    },
  });
}

