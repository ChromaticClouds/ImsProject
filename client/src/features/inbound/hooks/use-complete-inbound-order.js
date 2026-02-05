// @ts-check
import { useMutation } from '@tanstack/react-query';
import { completeInboundOrder } from '@/services/api';

/**
 * @returns {import('@tanstack/react-query').UseMutationResult<any, Error, number, unknown>}
 */
export function useCompleteInboundOrder() {
  return useMutation({
    /** @param {number} orderId */
    mutationFn: (orderId) => completeInboundOrder(orderId),
  });
}