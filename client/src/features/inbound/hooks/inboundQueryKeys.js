// @ts-check

export const inboundQueryKeys = {
  pendingSummary: (params) => ['inbound-pending-summary', params],
  pendingItems: (orderNumber) => ['inbound-pending-items', orderNumber],
};
