// @ts-check
export const outboundQueryKeys = {
  pendingSummary: (params) => ['outbound-pending-summary', params],
  pendingItems: (orderNumber) => ['outbound-pending-items', orderNumber],
  completedTodaySummary: (params) => ['outbound-completed-today-summary', params],
  completedItems: (orderNumber) => ['outbound-completed-items', orderNumber],
};


