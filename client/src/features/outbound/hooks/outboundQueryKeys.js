// @ts-check
export const outboundQueryKeys = {
  /** @param {OutboundSummaryParams} params */
  pendingSummary: (params) => ['outbound-pending-summary', params],
  /** @param {string} orderNumber */
  pendingItems: (orderNumber) => ['outbound-pending-items', orderNumber],
  /** @param {OutboundSummaryParams} params */
  completedTodaySummary: (params) => ['outbound-completed-today-summary', params],
  /** @param {string} orderNumber */
  completedItems: (orderNumber) => ['outbound-completed-items', orderNumber],
};

/**
 * @typedef {{
 *  from?: string,
 *  to?: string,
 *  userId?: number,
 *  page?: number,
 *  size?: number,
 * }} OutboundSummaryParams
 */

