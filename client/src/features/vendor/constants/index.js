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

export const VENDOR_DETAIL_HEADER = {
  title: '거래처 상세',
  description: '거래처 기본 정보와 공급 품목 단가를 확인합니다.',
};

export const VENDOR_TYPE_STYLES = {
  Supplier: {
    wrapper: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950',
    icon: 'bg-blue-500 text-white',
    title: 'text-blue-900 dark:text-blue-100',
    description: 'text-blue-600 dark:text-blue-400',
  },
  Seller: {
    wrapper:
      'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950',
    icon: 'bg-emerald-500 text-white',
    title: 'text-emerald-900 dark:text-emerald-100',
    description: 'text-emerald-600 dark:text-emerald-400',
  },
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

export const VENDOR_DETAIL_EMPTY = {
  loadError: {
    title: '거래처 정보를 불러오지 못했습니다.',
    description: '잠시 후 다시 시도해 주세요.',
  },
  notFound: {
    title: '거래처 정보를 찾을 수 없습니다.',
    description: '데이터가 없거나 삭제된 거래처일 수 있습니다.',
  },
};

export const SUPPLIER_VENDOR = {
  type: 'Supplier',
  bossName: '김민준',
  vendorName: '한빛 식자재',
  telephone: '02-1234-5678',
  email: 'contact@hanbit-food.example',
  address: '서울특별시 송파구 올림픽로 240',
  memo: '월요일 오전 입고 선호. 냉장 품목은 출고 전 재고 확인 필요.',
};

export const SUPPLIER_ITEMS = [
  {
    productId: 101,
    productName: '프리미엄 원두 1kg',
    brand: 'Bean Works',
    type: '식품',
    purchasePrice: 18500,
  },
  {
    productId: 102,
    productName: '무라벨 생수 500ml',
    brand: 'Clear Spring',
    type: '음료',
    purchasePrice: 420,
  },
  {
    productId: 103,
    productName: '친환경 종이컵 13oz',
    brand: 'Green Pack',
    type: '소모품',
    purchasePrice: 74,
  },
];

export const SELLER_VENDOR = {
  type: 'Seller',
  bossName: '이서연',
  vendorName: '도담 리테일',
  telephone: '031-987-6543',
  email: 'sales@dodam-retail.example',
  address: '경기도 성남시 분당구 판교역로 166',
  memo: '',
};

/**
 * @type {Record<VendorType, string>}
 */
export const VENDOR_DESCRIPTION = {
  Supplier: '기본 정보와 공급 품목 단가를 확인합니다.',
  Seller: '거래처 기본 정보를 확인합니다.',
};
