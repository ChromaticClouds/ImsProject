// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';

// (1) 단건 전송 API가 있는 경우 (너가 이미 쓰는 것)
import {
  bulkSendPurchaseOrders,
  sendPurchaseOrder,
} from '@/features/purchase-order/api/index.js';

/**
 * @typedef {{ orderNumbers: string[] }} BulkSendVars
 */

export const usePoBulkSendMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: /** @param {BulkSendVars} vars */ ({ orderNumbers }) =>
      bulkSendPurchaseOrders(orderNumbers),

    onSuccess: (res) => {
      if (res?.success === false) return;
      toast.success(res?.message ?? '전송되었습니다.');
      qc.invalidateQueries({ queryKey: ['purchase-orders'] });
    },

    onError: async (err) => {
      if (err instanceof HTTPError) {
        const errResponse = await err.response.json().catch(() => null);
        toast.error(
          typeof errResponse?.message === 'string'
            ? errResponse.message
            : ERROR.UNEXPECTED_ERROR,
        );
        return;
      }
      toast.error(ERROR.SERVER_ERROR);
    },
  });
};
