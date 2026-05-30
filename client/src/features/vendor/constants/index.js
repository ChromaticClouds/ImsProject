/**
 * @typedef {'Supplier' | 'Seller'} VendorType
 */

/**
 * @type {Record<VendorType, string>}
 */
export const VENDOR_TYPE_MAP = {
  Supplier: '공급처',
  Seller: '판매처',
};

export const VENDOR_EDIT_HEADER = {
  title: '거래처 수정',
  description: '기본 정보를 수정하고, 공급처인 경우 품목/단가를 관리합니다.',
};

export const VENDOR_EDIT_EMPTY = {
  loadError: {
    title: '거래처 정보를 불러오지 못했습니다.',
    description: '잠시 후 다시 시도해 주세요.',
  },
  notFound: {
    title: '거래처 정보를 찾을 수 없습니다.',
    description: '데이터가 없거나 삭제된 거래처일 수 있습니다.',
  },
};
