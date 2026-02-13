export const todos = [
  {
    id: 1,
    userId: 'admin',
    title: '월간 재고 실사 진행',
    description:
      '창고 내 전체 품목에 대해 월간 재고 실사를 진행한다.\n' +
      '실사 결과는 재고 조정 메뉴를 통해 반영할 것.',
    createdAt: '2026-02-01',
    startDate: '2026-02-03',
    endDate: '2026-02-05',
    tages: ['재고', '실사', '필수'],
    status: 'IN_PROGRESS', // TODO | IN_PROGRESS | DONE
  },
  {
    id: 2,
    userId: 'admin',
    title: '신규 주류 품목 등록',
    description:
      '2월 신규 입고 예정인 주류 품목을 시스템에 사전 등록한다.\n' +
      '품목 코드 중복 여부 반드시 확인.',
    createdAt: '2026-02-02',
    startDate: '2026-02-04',
    endDate: '2026-02-04',
    tages: ['품목', '등록'],
    status: 'TODO',
  },
  {
    id: 3,
    userId: 'warehouse01',
    title: '입고 예정 발주 확인',
    description:
      '이번 주 입고 예정 발주 건을 확인하고 입고 일정 조율.\n' +
      '거래처와 수량 변동 여부 체크.',
    createdAt: '2026-02-02',
    startDate: '2026-02-03',
    endDate: '2026-02-06',
    tages: ['입고', '발주'],
    status: 'IN_PROGRESS',
  },
  {
    id: 4,
    userId: 'warehouse01',
    title: '출고 지연 건 처리',
    description:
      '출고 지연된 주문 건을 확인하고 원인 분석.\n' +
      '필요 시 거래처에 지연 사유 안내.',
    createdAt: '2026-01-30',
    startDate: '2026-02-01',
    endDate: '2026-02-02',
    tages: ['출고', '이슈'],
    status: 'DONE',
  },
  {
    id: 5,
    userId: 'employee02',
    title: '재고 수량 오류 확인',
    description:
      '시스템 상 재고 수량과 실제 수량이 맞지 않는 품목 확인.\n' +
      '오류 품목 리스트 작성 후 관리자에게 공유.',
    createdAt: '2026-02-03',
    startDate: '2026-02-03',
    endDate: '2026-02-04',
    tages: ['재고', '오류'],
    status: 'TODO',
  },
];
