// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { completeOutboundByOrderNumber } from '../api/index';

/**
 * @typedef {{ orderNumber: string, memo?: string }} CompleteOutboundVars
 */

export function useCompleteOutbound() {
  const qc = useQueryClient();
  const nav = useNavigate();

  /** @type {import('@tanstack/react-query').UseMutationResult<any, unknown, CompleteOutboundVars, unknown>} */
  const m = useMutation({
    /** @param {CompleteOutboundVars} vars */
    mutationFn: async (vars) => {
      const orderNumber = vars.orderNumber;
      const memo = vars.memo;

      if (!orderNumber) throw new Error('수주번호가 없습니다.');
      return await completeOutboundByOrderNumber(orderNumber, { memo: memo || undefined });
    },

    /** @param {any} _data @param {CompleteOutboundVars} vars */
    onSuccess: async (_data, vars) => {
      const orderNumber = vars.orderNumber;

      await qc.invalidateQueries({ queryKey: ['outbound-pending-summary'] });
      await qc.invalidateQueries({ queryKey: ['outbound-completed-today-summary'] });

  
      await qc.invalidateQueries({ queryKey: ['outbound-pending-items', orderNumber] });
      await qc.invalidateQueries({ queryKey: ['outbound-completed-items', orderNumber] });

      await qc.invalidateQueries({
      predicate: (q) => Array.isArray(q.queryKey) && String(q.queryKey[0] ?? '').startsWith('outbound-'),
      });
      await qc.refetchQueries({
      predicate: (q) => Array.isArray(q.queryKey) && String(q.queryKey[0] ?? '').startsWith('outbound-'),
      });

      nav('/dashboard/outbounds/pending');
    },
  });

  return { mutateAsync: m.mutateAsync, isPending: m.isPending };
}

