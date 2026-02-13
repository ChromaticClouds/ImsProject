// @ts-check

export const inboundQueryKeys = {
  pendingSummary: (params) => ['inbound-pending-summary', normalizeParams(params)],
  pendingItems: (orderNumber) => ['inbound-pending-items', orderNumber],

  completedTodaySummary: (params) => ['inbound-completed-today-summary', normalizeParams(params)],
  completedItems: (orderNumber) => ['inbound-completed-items', orderNumber],

  pendingDetail: (orderNumber) => ['inbound-pending-detail', orderNumber],
};

function normalizeParams(params) {
  const p = params ?? {};
  return {
    from: p.from ?? '',
    to: p.to ?? '',
    page: Number.isFinite(p.page) ? p.page : 0,
    size: Number.isFinite(p.size) ? p.size : 20,
    keyword: typeof p.keyword === 'string' ? p.keyword : '',
  };
}
