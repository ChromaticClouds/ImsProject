// @ts-check
import { useQueryClient } from '@tanstack/react-query';
import { useCompleteInboundOrder } from './use-complete-inbound-order';

/**
 * @param {{
 *  orderNumber?: string,
 *  getItems: () => import('../types').InboundPendingItem[],
 *  onError?: (msg: string) => void,
 *  onSuccess?: () => void,
 * }} args
 */
export function useRegisterInbound({ orderNumber, getItems, onError, onSuccess }) {
  const qc = useQueryClient();
  const { mutateAsync: completeOne, isPending } = useCompleteInboundOrder();

  const register = async () => {
    onError?.('');

    try {
      const items = getItems();
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('해당 발주번호에 품목이 없습니다.');
      }

      await Promise.all(items.map((i) => completeOne(i.orderId)));

    
      await qc.invalidateQueries({ queryKey: ['inbound-pending-summary'], exact: false });
      await qc.invalidateQueries({ queryKey: ['inbound-pending-items'], exact: false });
      await qc.invalidateQueries({ queryKey: ['inbound-pending-detail'], exact: false });

      if (orderNumber) {
        await qc.invalidateQueries({ queryKey: ['inbound-pending-items', orderNumber], exact: true });
        await qc.invalidateQueries({ queryKey: ['inbound-pending-detail', orderNumber], exact: true });
      }

      onSuccess?.();
    } catch (e) {
      onError?.(/** @type {any} */ (e)?.message || '입고 등록 실패');
    }
  };

  return { register, isPending };
}
