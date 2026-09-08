// @ts-check
export const historyQueryKeys = {
  /** @param {HistoryParams} params */
  lots: (params) => ['history-lots', params],
  /** @param {number | null} lotId */
  lotDetail: (lotId) => ['history-lot-detail', lotId],
  /** @param {string} q */
  search: (q) => ['history-search', q],
  /** @param {string} type */
  brands: (type) => ['history-brands', type],
};
