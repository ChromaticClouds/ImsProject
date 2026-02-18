import {
  HomeIcon,
  CalendarIcon,
  MegaphoneIcon,
  PackageIcon,
  ArrowBigUpDashIcon,
  ArrowBigDownDashIcon,
  ArrowDownUpIcon,
  FileInputIcon,
  FileOutputIcon,
  HandshakeIcon,
  ChartAreaIcon,
} from 'lucide-react';

export const SIDEBAR_MAIN_ITEMS = [
  {
    title: '메인 페이지',
    url: '/dashboard',
    Icon: HomeIcon,
  },
  {
    title: '공지사항',
    url: '/dashboard/notice',
    Icon: MegaphoneIcon,
  },
];

export const SIDEBAR_PRODUCT_ITEMS = [
  {
    title: '품목',
    url: '/dashboard/product',
    Icon: PackageIcon,
  },
  {
    title: '발주',
    url: '/dashboard/purchase-order',
    Icon: FileOutputIcon,
  },
  {
    title: '입고',
    url: '/dashboard/inbounds/pending',
    Icon: ArrowBigDownDashIcon,
  },
  {
    title: '수주',
    url: '/dashboard/receive-order',
    Icon: FileInputIcon,
  },
  {
    title: '출고',
    url: '/dashboard/outbounds/pending',
    Icon: ArrowBigUpDashIcon,
  },
  {
    title: '조정',
    url: '/dashboard/adjust',
    Icon: ArrowDownUpIcon,
  },
];

export const SIDEBAR_ADDITIONAL_ITEMS = [
  {
    title: '거래처',
    url: '/dashboard/vendor',
    Icon: HandshakeIcon,
  },
  {
    title: '통계 및 리포트',
    url: '/dashboard/statistics',
    Icon: ChartAreaIcon,
  },
  {
    title: '히스토리',
    url: '/dashboard/history',
    Icon: ChartAreaIcon,
  },
];

export const RANK_LABEL = {
  FIRST_ADMIN: '총괄 책임자',
  SECOND_ADMIN: '창고 관리자',
  EMPLOYEE: '사원',
};

export const ROLE_LABEL = {
  NONE: '권한 없음',
  INBOUND: '입고',
  PLACE_ORDER: '발주',
  OUTBOUND: '출고',
  RECEIVE_ORDER: '수주',
  ALL: '전체 권한',
};

// ------------ 히스토리에 필요한 것 

export const HISTORY_STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'INBOUND', label: '입고' },
  { value: 'OUTBOUND', label: '출고' },
  { value: 'ADJUST', label: '조정' },
];

export const PRODUCT_TYPE_OPTIONS = [
  { value: 'SOJU', label: '소주' },
  { value: 'LIQUOR', label: '양주' },
  { value: 'WHISKEY', label: '위스키' },
  { value: 'TRADITIONAL', label: '전통주' },
  { value: 'KAOLIANG_LIQUOR', label: '고량주' },
];

export function toKoreanType(type) {
  const m = {
    SOJU: '소주',
    LIQUOR: '양주',
    WHISKEY: '위스키',
    TRADITIONAL: '전통주',
    KAOLIANG_LIQUOR: '고량주',
  };
  return m[type] ?? type;
}
