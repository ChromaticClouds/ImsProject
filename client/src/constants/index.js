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
    url: '#',
    Icon: PackageIcon,
  },
  {
    title: '발주',
    url: '#',
    Icon: FileOutputIcon,
  },
  {
    title: '입고',
    url: '#',
    Icon: ArrowBigDownDashIcon,
  },
  {
    title: '수주',
    url: '#',
    Icon: FileInputIcon,
  },
  {
    title: '출고',
    url: '#',
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
    url: '#',
    Icon: HandshakeIcon,
  },
  {
    title: '통계 및 리포트',
    url: '#',
    Icon: ChartAreaIcon,
  },
];
