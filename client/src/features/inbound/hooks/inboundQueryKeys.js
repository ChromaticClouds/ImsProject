// @ts-check

export const inboundQueryKeys = {
  /** @param {InboundQueryParams} params */
  pendingSummary: (params) => ['inbound-pending-summary', normalizeParams(params)],
  /** @param {string} orderNumber */
  pendingItems: (orderNumber) => ['inbound-pending-items', orderNumber],

  /** @param {InboundQueryParams} params */
  completedTodaySummary: (params) => ['inbound-completed-today-summary', normalizeParams(params)],
  /** @param {string} orderNumber */
  completedItems: (orderNumber) => ['inbound-completed-items', orderNumber],

  /** @param {string} orderNumber */
  pendingDetail: (orderNumber) => ['inbound-pending-detail', orderNumber],
};

/**
 * @typedef {{
 *  from?: string,
 *  to?: string,
 *  page?: number,
 *  size?: number,
 *  keyword?: string,
 * }} InboundQueryParams
 */

/** @param {InboundQueryParams | undefined} params */
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
