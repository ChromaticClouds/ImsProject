import {
  PackageIcon,
  ArrowBigUpDashIcon,
  ArrowBigDownDashIcon,
  FileInputIcon,
  FileOutputIcon,
  HandshakeIcon,
  ChartAreaIcon,
} from 'lucide-react';

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
