// vendor-mock.js

// vendor 컬럼명
// id, type, vendor_name, telephone, email, boss_name,
// address, memo, image_url, created_at, status

// 변수명
// id, type, vendorName, telephone, email, bossName,
// address, memo, imageUrl, createdAt, status

export const testvendors = [
  {
    id: 301,
    type: 'SUPPLIER',
    vendorName: '하이트진로',
    telephone: '02-1234-5678',
    email: 'sales@hitejinro.co.kr',
    bossName: '홍길동',
    address: '서울특별시 강남구 테헤란로 123',
    memo: '주류 주요 공급처',
    imageUrl: null,
    createdAt: '2025-01-01',
    status: 'ACTIVE',
  },
  {
    id: 302,
    type: 'SUPPLIER',
    vendorName: '롯데칠성음료',
    telephone: '02-2345-6789',
    email: 'order@lotte.co.kr',
    bossName: '김철수',
    address: '서울특별시 송파구 올림픽로 300',
    memo: '음료/주류 공급',
    imageUrl: null,
    createdAt: '2025-01-05',
    status: 'ACTIVE',
  },
  {
    id: 303,
    type: 'SUPPLIER',
    vendorName: '오비맥주',
    telephone: '02-3456-7890',
    email: 'contact@obbeer.co.kr',
    bossName: '이영희',
    address: '서울특별시 중구 세종대로 50',
    memo: '맥주 전문 공급처',
    imageUrl: null,
    createdAt: '2025-01-10',
    status: 'ACTIVE',
  },
  {
    id: 304,
    type: 'SUPPLIER',
    vendorName: '국순당',
    telephone: '02-4567-8901',
    email: 'biz@guksundang.co.kr',
    bossName: '박민수',
    address: '서울특별시 성동구 왕십리로 45',
    memo: '전통주 공급',
    imageUrl: null,
    createdAt: '2025-01-12',
    status: 'ACTIVE',
  },
  {
    id: 305,
    type: 'SUPPLIER',
    vendorName: '금복주',
    telephone: '053-123-4567',
    email: 'sales@kumbokju.co.kr',
    bossName: '최성훈',
    address: '대구광역시 달서구 성서로 100',
    memo: '소주 공급처',
    imageUrl: null,
    createdAt: '2025-01-15',
    status: 'INACTIVE',
  },
];
