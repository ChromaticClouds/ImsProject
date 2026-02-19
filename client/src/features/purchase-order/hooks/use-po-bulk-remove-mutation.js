// @ts-check

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';

import { bulkDeletePurchaseOrders } from '@/features/purchase-order/api/index.js';

/**
 * @typedef {{ orderNumbers: string[] }} BulkRemoveVars
 */

export const usePoBulkRemoveMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: /** @param {BulkRemoveVars} vars */ ({ orderNumbers }) =>
      bulkDeletePurchaseOrders(orderNumbers),

    onSuccess: (res, vars) => {
      if (res?.success === false) return;
      toast.success(res?.message ?? '삭제되었습니다.');
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
