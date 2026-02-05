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
  {
    title: '투두리스트',
    url: '/dashboard/todo',
    Icon: CalendarIcon,
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
    url: '#',
    Icon: FileOutputIcon,
  },
  {
    title: '입고',
    url: '/dashboard/inbounds/pending',
    Icon: ArrowBigDownDashIcon,
  },
  {
    title: '수주',
    url: '#',
    Icon: FileInputIcon,
  },
  {
    title: '출고',
    url: '/dashboard/outbounds/pending',
    Icon: ArrowBigUpDashIcon,
  },
  {
    title: '조정',
    url: '#',
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

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: '참이슬 후레쉬',
    product_code: 'SOJU-001',
    category: '소주',
    brand: '하이트진로',
    sale_price :1500,
    boxQuantity: 30,
    regDate: '2024-01-15',
    boximage: 'https://picsum.photos/id/1/40/40',
    singleimage: 'https://picsum.photos/id/1/40/40'
  },
  {
    id: 2,
    name: '발렌타인 21년',
    product_code: 'WHI-021',
    category: '위스키',
    brand: '발렌타인',
    sale_price :1500,
    boxQuantity: 6,
    regDate: '2024-01-20',
    boximage: 'https://picsum.photos/id/2/40/40',
    singleimage: 'https://picsum.photos/id/2/40/40'
  },
  {
    id: 3,
    name: '연태고량주',
    product_code: 'CHIN-500',
    category: '고량주',
    brand: '연태',
    sale_price :1500,
    boxQuantity: 12,
    regDate: '2024-02-01',
    boximage: 'https://picsum.photos/id/3/40/40',
    singleimage: 'https://picsum.photos/id/3/40/40'
  },
  {
    id: 4,
    name: '일품진로',
    product_code: 'SOJU-002',
    category: '소주',
    brand: '하이트진로',
    sale_price :1500,
    boxQuantity: 6,
    regDate: '2024-02-05',
    boximage: 'https://picsum.photos/id/4/40/40',
    singleimage: 'https://picsum.photos/id/4/40/40'
  },
  {
    id: 5,
    name: '화요 25도',
    product_code: 'TRAD-025',
    category: '전통주',
    brand: '화요',
    sale_price :1500,
    boxQuantity: 12,
    regDate: '2024-02-10',
    boximage: 'https://picsum.photos/id/5/40/40',
    singleimage: 'https://picsum.photos/id/5/40/40'
  },
  {
    id: 6,
    name: '조니워커 블랙',
    product_code: 'WHI-101',
    category: '위스키',
    brand: '조니워커',
    sale_price :1500,
    boxQuantity: 12,
    regDate: '2024-02-12',
    boximage: 'https://picsum.photos/id/6/40/40',
    singleimage: 'https://picsum.photos/id/6/40/40'
  },
  {
    id: 7,
    name: '처음처럼',
    product_code: 'SOJU-003',
    category: '소주',
    brand: '롯데칠성',
    sale_price :1500,
    boxQuantity: 30,
    regDate: '2024-02-15',
    boximage: 'https://picsum.photos/id/7/40/40',
    singleimage: 'https://picsum.photos/id/7/40/40'
  },
  {
    id: 8,
    name: '맥칼란 12년',
    product_code: 'WHI-112',
    category: '위스키',
    brand: '맥칼란',
    sale_price :1500,
    boxQuantity: 6,
    regDate: '2024-02-18',
    boximage: 'https://picsum.photos/id/8/40/40',
    singleimage: 'https://picsum.photos/id/8/40/40'
  },
  {
    id: 9,
    name: '공부가주',
    product_code: 'CHIN-300',
    category: '고량주',
    brand: '공부가주',
    sale_price :1500,
    boxQuantity: 12,
    regDate: '2024-02-20',
    boximage: 'https://picsum.photos/id/9/40/40',
    singleimage: 'https://picsum.photos/id/9/40/40'
  },
  {
    id: 10,
    name: '경주법주',
    product_code: 'TRAD-777',
    category: '전통주',
    brand: '경주법주',
    sale_price :1500,
    boxQuantity: 20,
    regDate: '2024-02-22',
    boximage: 'https://picsum.photos/id/10/40/40',
    singleimage: 'https://picsum.photos/id/10/40/40'
  },
  {
    id: 11,
    name: '시바스리갈 18년',
    product_code: 'WHI-018',
    category: '위스키',
    brand: '시바스',
    sale_price :1500,
    boxQuantity: 6,
    regDate: '2024-02-25',
    boximage: 'https://picsum.photos/id/11/40/40',
    singleimage: 'https://picsum.photos/id/11/40/40'
  },
  {
    id: 12,
    name: '진로 이즈 백',
    product_code: 'SOJU-004',
    category: '소주',
    brand: '하이트진로',
    sale_price :1500,
    boxQuantity: 30,
    regDate: '2024-02-28',
    boximage: 'https://picsum.photos/id/12/40/40',
    singleimage: 'https://picsum.photos/id/12/40/40'
  },
];
