import {
  BarChart3Icon,
  BellIcon,
  ClipboardCheckIcon,
  HistoryIcon,
  PackageIcon,
  ScaleIcon,
  SendIcon,
  ShieldCheckIcon,
  TruckIcon,
} from 'lucide-react';

export const landingNavItems = [
  { label: '기능', href: '#features' },
  { label: '업무 흐름', href: '#workflow' },
  { label: '통계', href: '#analytics' },
  { label: '접근 제어', href: '#operations' },
];

export const heroStats = [
  { value: '8+', label: '업무 화면 구성' },
  { value: 'Role', label: '역할·등급 접근 제어' },
  { value: 'Send', label: '발주서 전송 요청' },
];

export const featureCards = [
  {
    title: '품목 · 현재고 관리',
    description:
      '품목 유형, 브랜드, 거래처, 현재 수량을 기준으로 재고 목록을 조회하고 관리합니다.',
    icon: PackageIcon,
    wide: true,
  },
  {
    title: '입고 관리',
    description: '입고 대기 건과 완료 건을 확인하고 상세 품목 단위로 처리 흐름을 이어갑니다.',
    icon: ClipboardCheckIcon,
  },
  {
    title: '출고 관리',
    description: '출고 대기 목록과 등록 화면을 통해 출고 업무를 대시보드 안에서 처리합니다.',
    icon: TruckIcon,
  },
  {
    title: '발주 관리',
    description: '발주서 작성, 목록 조회, 단건·일괄 전송 요청을 발주 화면에서 수행합니다.',
    icon: SendIcon,
  },
  {
    title: '재고 조정',
    description: '현재고와 실제 수량의 차이를 조정 업무로 분리해 기록합니다.',
    icon: ScaleIcon,
  },
  {
    title: '통계 리포트',
    description: '입출고 합계, 재고 점유율, 거래처 순위, 회전율, 리드타임을 차트로 조회합니다.',
    icon: BarChart3Icon,
  },
  {
    title: '이력 추적',
    description: '품목별 최신 이력과 로트 단위 상세 흐름을 필요한 시점에 조회합니다.',
    icon: HistoryIcon,
  },
  {
    title: '공지 · 할 일',
    description: '운영 공지와 업무 Todo를 함께 관리해 관리자 커뮤니케이션을 보조합니다.',
    icon: BellIcon,
  },
];

export const workflowSteps = [
  ['01', '품목 등록', '품목, 브랜드, 거래처, 안전재고 기준을 먼저 구성합니다.'],
  ['02', '발주 생성', '공급처별 발주서를 만들고 전송 요청 대상으로 관리합니다.'],
  ['03', '입고 처리', '입고 대기 건과 품목 상세를 확인하며 입고 업무를 진행합니다.'],
  ['04', '출고 처리', '출고 대기 건을 확인하고 필요한 출고 등록으로 이어갑니다.'],
  ['05', '이력·통계', '재고 변동 이력과 리드타임, 회전율을 리포트로 확인합니다.'],
];

export const analyticsRows = [
  ['입고/출고 수량 합계', '기간 조건'],
  ['재고 점유율', '품목별 비중'],
  ['거래처 순위', '발주·수주 기준'],
  ['리드타임', '발주→입고'],
];

export const operationRows = [
  ['발주 관리 화면', 'PLACE_ORDER / ALL', '권한 필요'],
  ['입고 관리 화면', 'INBOUND / ALL', '권한 필요'],
  ['출고 관리 화면', 'OUTBOUND / ALL', '권한 필요'],
  ['사용자·거래처 관리', 'ALL + 관리자 등급', '관리자'],
];

export const dashboardMenu = [
  '메인 페이지',
  '품목 관리',
  '입고 관리',
  '출고 관리',
  '재고 조정',
  '발주 관리',
  '통계',
];

export const dashboardMetrics = [
  ['품목 관리', '검색', '주종·브랜드 필터'],
  ['입고 업무', '대기', '상세 품목 확인'],
  ['통계 조회', '차트', '기간 조건 적용'],
];

export const dashboardTasks = [
  ['발주서 전송 요청', '발주'],
  ['입고 대기 건 처리', '입고'],
  ['재고 조정 등록', '조정'],
  ['로트 이력 상세 조회', '이력'],
];

export const ctaHighlights = [
  { label: '권한', icon: ShieldCheckIcon },
  { label: '발주', icon: SendIcon },
  { label: '통계', icon: BarChart3Icon },
];
