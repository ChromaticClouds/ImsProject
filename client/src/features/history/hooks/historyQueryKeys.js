// @ts-check
export const historyQueryKeys = {
  lots: (params) => ['history-lots', params],
  lotDetail: (lotId) => ['history-lot-detail', lotId],
  search: (q) => ['history-search', q],
  brands: (type) => ['history-brands', type],
};
