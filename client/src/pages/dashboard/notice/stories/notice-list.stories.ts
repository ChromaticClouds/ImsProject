import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import { createElement } from 'react';
import {
  expect,
  fn,
  userEvent,
  within,
} from 'storybook/test';

import {
  NoticeListView,
  type NoticeListItem,
} from '@/features/notice/components/notice-list-view/notice-list-view';
import { NoticeListApiContainer } from '@/pages/dashboard/notice/stories/notice-list-api-container';

const meta = {
  title: 'Notice/List',
  component: NoticeListView,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      createElement(
        'div',
        { className: 'w-[720px] bg-background p-6' },
        createElement(Story),
      )
    ),
  ],
} satisfies Meta<typeof NoticeListView>;

export default meta;

type Story = StoryObj<typeof meta>;

const getCanvas = (canvasElement: HTMLElement) => within(canvasElement);

const pinnedNotices: NoticeListItem[] = [
  {
    id: 156,
    title: '시스템 정기 점검 안내 (6월 5일 02:00~06:00)',
    pinned: true,
    author: { id: 1, eid: '2026-0011', name: '강동우' },
    createdAt: '2026-06-02',
    hasAttachment: true,
  },
  {
    id: 128,
    title: '[신규 기능] 엑셀 대량 등록 양식 변경 안내',
    pinned: true,
    author: { id: 2, eid: '2026-0022', name: '이정재' },
    createdAt: '2026-02-14',
    hasAttachment: false,
  },
];

const notices: NoticeListItem[] = [
  {
    id: 154,
    title: '2월 24일 엘리베이터 수리 안내',
    pinned: false,
    author: { id: 1, eid: '2026-0011', name: '강동우' },
    createdAt: '2026-02-24',
    hasAttachment: true,
  },
  {
    id: 143,
    title: '3월 정기 회의 일정 공지',
    pinned: false,
    author: { id: 2, eid: '2026-0022', name: '이정재' },
    createdAt: '2026-02-20',
    hasAttachment: false,
  },
  {
    id: 142,
    title: '현장 안전 점검 필요 안내',
    pinned: false,
    author: { id: 1, eid: '2026-0011', name: '강동우' },
    createdAt: '2026-02-23',
    hasAttachment: false,
  },
];

const apiPageOneResponse = {
  pinned: [
    {
      id: 301,
      title: 'API 중요 공지 응답 테스트',
      content: '중요 공지 응답 테스트 내용입니다.',
      pinned: true,
      createdAt: '2026-06-03',
      hasAttachment: true,
      userName: '강동우',
    },
  ],
  items: [
    {
      id: 302,
      title: 'API 일반 공지 응답 테스트',
      content: '일반 공지 응답 테스트 내용입니다.',
      pinned: false,
      createdAt: '2026-06-02',
      hasAttachment: false,
      userName: '이정재',
    },
  ],
  page: 1,
  totalElements: 3,
  totalPages: 2,
};

const apiPageTwoResponse = {
  pinned: [],
  items: [
    {
      id: 303,
      title: 'API 두 번째 페이지 공지',
      content: '두 번째 페이지 응답 테스트 내용입니다.',
      pinned: false,
      createdAt: '2026-06-01',
      hasAttachment: true,
      userName: '관리자',
    },
  ],
  page: 2,
  totalElements: 3,
  totalPages: 2,
};

const apiNoticeListHandler = http.get('*/api/notice/list', ({ request }) => {
  const page = Number(new URL(request.url).searchParams.get('page') ?? 1);

  return HttpResponse.json(
    page === 2 ? apiPageTwoResponse : apiPageOneResponse,
  );
});

export const Default = {
  args: {
    pinned: pinnedNotices,
    items: notices,
    page: 1,
    totalPages: 5,
    onCreate: fn(),
    onSelectNotice: fn(),
    onPageChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = getCanvas(canvasElement);

    await expect(
      canvas.getByText('시스템 정기 점검 안내 (6월 5일 02:00~06:00)'),
    ).toBeInTheDocument();
    await expect(canvas.getAllByText('중요')).toHaveLength(2);
    await expect(canvas.getAllByLabelText('첨부파일 있음')).toHaveLength(2);

    const searchInput = canvas.getByPlaceholderText('제목, 작성자 검색...');
    await userEvent.type(searchInput, '점검');
    await expect(searchInput).toHaveValue('점검');

    await userEvent.click(canvas.getByRole('button', { name: '작성' }));
    await expect(args.onCreate).toHaveBeenCalled();

    await userEvent.click(
      canvas.getByRole('button', {
        name: /시스템 정기 점검 안내 \(6월 5일 02:00~06:00\)/,
      }),
    );
    await expect(args.onSelectNotice).toHaveBeenCalledWith(156);

    await userEvent.click(canvas.getByRole('link', { name: '2' }));
    await expect(args.onPageChange).toHaveBeenCalledWith(2);
  },
} satisfies Story;

export const Empty = {
  args: {
    pinned: [],
    items: [],
    page: 1,
    totalPages: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);

    await expect(
      canvas.getByText('등록된 공지사항이 없습니다.'),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText('새 공지사항을 작성하면 이곳에 표시됩니다.'),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: '다음 페이지' }),
    ).toHaveAttribute('aria-disabled', 'true');
  },
} satisfies Story;

export const Loading = {
  args: {
    pinned: [],
    items: [],
    page: 1,
    totalPages: 5,
    isLoading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);

    await expect(
      canvas.getByRole('status', { name: '공지사항 로딩 중' }),
    ).toBeInTheDocument();
    await expect(canvas.queryByText('등록된 공지사항이 없습니다.')).toBeNull();
  },
} satisfies Story;

export const Error = {
  args: {
    pinned: [],
    items: [],
    page: 1,
    totalPages: 5,
    error: '서버와 연결할 수 없습니다.',
    onRetry: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = getCanvas(canvasElement);

    await expect(
      canvas.getByText('공지사항을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText('서버와 연결할 수 없습니다.'),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: '다시 시도' }));
    await expect(args.onRetry).toHaveBeenCalled();
  },
} satisfies Story;

export const SearchEmpty = {
  args: {
    pinned: [],
    items: [],
    page: 1,
    totalPages: 1,
    searchValue: '엘리베이터',
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);

    await expect(canvas.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    await expect(
      canvas.getByText('"엘리베이터"에 대한 공지사항을 찾을 수 없습니다.'),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: '다음 페이지' }),
    ).toHaveAttribute('aria-disabled', 'true');
  },
} satisfies Story;

export const ApiSuccess = {
  render: (args) => createElement(NoticeListApiContainer, args),
  args: {
    initialPage: 1,
    onCreate: fn(),
    onSelectNotice: fn(),
    onPageChange: fn(),
  },
  parameters: {
    msw: {
      handlers: [apiNoticeListHandler],
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = getCanvas(canvasElement);

    await expect(
      await canvas.findByText('API 중요 공지 응답 테스트'),
    ).toBeInTheDocument();
    await expect(canvas.getByText('API 일반 공지 응답 테스트')).toBeInTheDocument();
    await expect(canvas.getByText('강동우')).toBeInTheDocument();
    await expect(canvas.getAllByLabelText('첨부파일 있음')).toHaveLength(1);

    await userEvent.click(
      canvas.getByRole('button', { name: /API 중요 공지 응답 테스트/ }),
    );
    await expect(args.onSelectNotice).toHaveBeenCalledWith(301);

    await userEvent.click(canvas.getByRole('link', { name: '2' }));
    await expect(args.onPageChange).toHaveBeenCalledWith(2);
    await expect(
      await canvas.findByText('API 두 번째 페이지 공지'),
    ).toBeInTheDocument();
  },
} satisfies Story;

export const ApiError = {
  render: (args) => createElement(NoticeListApiContainer, args),
  args: {
    initialPage: 1,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/notice/list', () =>
          HttpResponse.json(
            { message: '서버 오류가 발생했습니다.' },
            { status: 500 },
          ),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);

    await expect(
      await canvas.findByText('공지사항을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText('서버와 연결할 수 없습니다.'),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: '다시 시도' }),
    ).toBeInTheDocument();
  },
} satisfies Story;
