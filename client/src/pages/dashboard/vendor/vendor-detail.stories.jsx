// @ts-check

import { fn } from 'storybook/test';
import { VendorDetailRenewal } from '@/pages/dashboard/vendor/vendor-detail-renewal.jsx';

const supplierVendor = {
  type: 'Supplier',
  bossName: '김민준',
  vendorName: '한빛 식자재',
  telephone: '02-1234-5678',
  email: 'contact@hanbit-food.example',
  address: '서울특별시 송파구 올림픽로 240',
  memo: '월요일 오전 입고 선호. 냉장 품목은 출고 전 재고 확인 필요.',
};

const supplierItems = [
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

const sellerVendor = {
  type: 'Seller',
  bossName: '이서연',
  vendorName: '도담 리테일',
  telephone: '031-987-6543',
  email: 'sales@dodam-retail.example',
  address: '경기도 성남시 분당구 판교역로 166',
  memo: '',
};

export default {
  title: 'Vendor/Detail',
  component: VendorDetailRenewal,
  args: {
    onBack: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const Supplier = {
  args: {
    vendor: supplierVendor,
    items: supplierItems,
  },
};

export const Seller = {
  args: {
    vendor: sellerVendor,
    items: [],
  },
};

export const EmptySupplierItems = {
  args: {
    vendor: supplierVendor,
    items: [],
  },
};
