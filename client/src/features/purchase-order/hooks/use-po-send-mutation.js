// @ts-check

/**
 * Hooks
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Api
*/
import { sendPurchaseOrder } from '@/features/purchase-order/api/index.js';

/**
 * Utils
 */
import { toast } from 'sonner';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';

export const usePoSendMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: /** @param {string} orderNumber */ (orderNumber) =>
      sendPurchaseOrder(orderNumber),

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
