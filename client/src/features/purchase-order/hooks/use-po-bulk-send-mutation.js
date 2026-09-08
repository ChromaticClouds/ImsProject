// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';
import { bulkSendPurchaseOrders } from '@/features/purchase-order/api/index.js';

/**
 * @typedef {{ orderNumbers: string[] }} BulkSendVars
 */

const FAIL_STAGE_MESSAGES = {
  LOAD: '발주 데이터 구성 실패',
  PDF: 'PDF 생성 실패',
  MAIL: '메일 전송 실패',
  SEND: '전송 상태 변경 실패',
};

/** @param {import('../api/index.js').BulkSendFailure[]} failed */
const getFailedOrderLabel = (failed) => {
  const orderNumbers = failed
    .map((fail) => fail?.orderNumber)
    .filter(Boolean);

  if (orderNumbers.length <= 3) {
    return orderNumbers.join(', ');
  }

  return `${orderNumbers.slice(0, 3).join(', ')} 외 ${orderNumbers.length - 3}건`;
};

/** @param {import('../api/index.js').BulkSendResult | undefined} data */
const showBulkSendResultToast = (data) => {
  const successCount = Number(data?.successCount ?? 0);
  const failCount = Number(data?.failCount ?? 0);
  const total = Number(data?.total ?? successCount + failCount);
  const failed = Array.isArray(data?.failed) ? data.failed : [];

  if (failCount === 0) {
    toast.success(`${successCount || total}건의 발주서를 전송했습니다.`);
    return;
  }

  if (successCount > 0) {
    toast.warning(
      `${total}건 중 ${successCount}건 전송, ${failCount}건 실패했습니다.`,
    );
  } else {
    toast.error(`${total}건의 발주서 전송에 실패했습니다.`);
  }

  Object.entries(FAIL_STAGE_MESSAGES).forEach(([stage, message]) => {
    const stageFailures = failed.filter((fail) => fail?.stage === stage);

    if (stageFailures.length === 0) return;

    toast.error(
      `${message}: ${stageFailures.length}건 (${getFailedOrderLabel(stageFailures)})`,
    );
  });
};

export const usePoBulkSendMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: /** @param {BulkSendVars} vars */ ({ orderNumbers }) =>
      bulkSendPurchaseOrders(orderNumbers),

    onSuccess: (res) => {
      if (res?.success === false) {
        toast.error(res?.message ?? ERROR.UNEXPECTED_ERROR);
        return;
      }

      showBulkSendResultToast(res?.data);
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
