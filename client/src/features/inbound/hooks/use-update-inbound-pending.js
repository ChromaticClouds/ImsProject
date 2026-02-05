// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inboundQueryKeys } from './inboundQueryKeys';
import { updateInboundPending } from '@/services/api';

/**
 * @typedef {{ orderId: number, orderQty: number }} PendingUpdateItem
 * @typedef {{ receiveDate: string|null, items: PendingUpdateItem[] }} PendingUpdatePayload
 */

/**
 * @param {string} orderNumber
 */
export function useUpdateInboundPending(orderNumber) {
  const qc = useQueryClient();

  return useMutation({
    /** @param {PendingUpdatePayload} payload */
    mutationFn: (payload) => updateInboundPending(orderNumber, payload),

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: inboundQueryKeys.pendingItems(orderNumber), exact: true });
      await qc.invalidateQueries({ queryKey: inboundQueryKeys.pendingDetail(orderNumber), exact: true });
      await qc.invalidateQueries({ queryKey: ['inbound-pending-summary'], exact: false });
    },
  });
}
