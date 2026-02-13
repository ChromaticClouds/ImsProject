export const inboundOutboundByItemMock = [
  { item: '맥주', inbound: 1240, outbound: 980 },
  { item: '소주', inbound: 980, outbound: 1100 },
  { item: '와인', inbound: 420, outbound: 380 },
  { item: '위스키', inbound: 300, outbound: 260 },
  { item: '막걸리', inbound: 650, outbound: 720 },
  { item: '음료수', inbound: 890, outbound: 760 },
];

export const inventoryTurnoverTrendMock = [
  { period: '1주차', turnover: 0.42 },
  { period: '2주차', turnover: 0.53 },
  { period: '3주차', turnover: 0.76 },
  { period: '4주차', turnover: 0.29 },
];

export const partnerRankMock = [
  { partner: '롯데마트', outbound: 820 },
  { partner: '이마트', outbound: 760 },
  { partner: '홈플러스', outbound: 540 },
  { partner: 'GS리테일', outbound: 430 },
  { partner: '쿠팡', outbound: 390 },
  { partner: '동네슈퍼연합', outbound: 210 },
];

export const stockShareMock = [
  { item: '맥주', stock: 320, fill: 'var(--chart-1)' },
  { item: '소주', stock: 280, fill: 'var(--chart-2)' },
  { item: '와인', stock: 120, fill: 'var(--chart-3)' },
  { item: '기타', stock: 90, fill: 'var(--chart-4)' },
  { item: '막걸리', stock: 150, fill: 'var(--chart-5)' },
  { item: '음료수', stock: 210, fill: 'var(--foreground)' },
];

// lead-time.mock.js
export const leadTimeMock = [
  { supplier: '에이스물류', leadTime: 2.3 },
  { supplier: '한빛상사', leadTime: 5.8 },
  { supplier: '대성유통', leadTime: 3.1 },
  { supplier: '태영공급', leadTime: 4.6 },
  { supplier: '오성무역', leadTime: 1.9 },
];

export const leadTimeByPartnerMock = [
  { name: '삼성물류', leadTime: 3.2 },
  { name: '한진상사', leadTime: 4.1 },
  { name: 'CJ대한통운', leadTime: 2.8 },
  { name: '로젠택배', leadTime: 5.0 },
  { name: '쿠팡풀필먼트', leadTime: 3.6 },
];

export const leadTimeByItemMock = [
  { name: '맥주', leadTime: 2.4 },
  { name: '소주', leadTime: 3.1 },
  { name: '와인', leadTime: 4.3 },
  { name: '위스키', leadTime: 5.5 },
  { name: '막걸리', leadTime: 2.9 },
];
