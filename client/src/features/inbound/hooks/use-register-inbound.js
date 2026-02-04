// @ts-check
import { useCompleteInboundOrder } from './use-complete-inbound-order';

/**
 * @param {{
 *  getItems: () => import('../types').InboundPendingItem[],
 *  onError?: (msg: string) => void,
 *  onSuccess?: () => void,
 * }} args
 */
export function useRegisterInbound({ getItems, onError, onSuccess }) {
  const { mutateAsync: completeOne, isPending } = useCompleteInboundOrder();

  const register = async () => {
    onError?.('');

    try {
      const items = getItems();
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('해당 발주번호에 품목이 없습니다.');
      }

      await Promise.all(items.map((i) => completeOne(i.orderId)));

      onSuccess?.();
      alert('입고 등록되었습니다');
    } catch (e) {
      onError?.(/** @type {any} */ (e)?.message || '입고 등록 실패');
    }
  };

  return { register, isPending };
}
