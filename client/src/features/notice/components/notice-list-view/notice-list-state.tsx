import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { NoticeListStateProps } from '@/features/notice/components/notice-list-view/notice-list-types';
import {
  ClipboardXIcon,
  LoaderCircleIcon,
  SearchIcon,
} from 'lucide-react';

export const NoticeListState = ({
  icon,
  title,
  description,
  action,
}: NoticeListStateProps) => (
  <Empty className='min-h-56 border-0'>
    <EmptyHeader>
      <EmptyMedia variant='icon'>{icon}</EmptyMedia>
      <EmptyTitle className='text-sm'>{title}</EmptyTitle>
      <EmptyDescription className='text-xs'>{description}</EmptyDescription>
    </EmptyHeader>
    {action && <EmptyContent>{action}</EmptyContent>}
  </Empty>
);

export const NoticeListLoadingState = () => (
  <div
    className='space-y-0'
    role='status'
    aria-label='공지사항 로딩 중'
  >
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className='flex items-center gap-4 border-b px-4 py-3 last:border-b-0'
      >
        <div className='h-4 w-8 animate-pulse rounded bg-muted' />
        <div className='min-w-0 flex-1 space-y-2'>
          <div className='h-4 w-3/5 animate-pulse rounded bg-muted' />
          <div className='h-3 w-2/5 animate-pulse rounded bg-muted' />
        </div>
        <LoaderCircleIcon
          className='size-4 animate-spin text-muted-foreground'
          aria-hidden='true'
        />
      </div>
    ))}
  </div>
);

export const NoticeListErrorState = ({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) => (
  <NoticeListState
    icon={
      <ClipboardXIcon
        className='size-5'
        aria-hidden='true'
      />
    }
    title='공지사항을 불러오지 못했습니다.'
    description={message ?? '잠시 후 다시 시도해주세요.'}
    action={
      onRetry ? (
        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={onRetry}
        >
          다시 시도
        </Button>
      ) : undefined
    }
  />
);

export const NoticeListEmptyState = () => (
  <NoticeListState
    icon={
      <ClipboardXIcon
        className='size-5'
        aria-hidden='true'
      />
    }
    title='등록된 공지사항이 없습니다.'
    description='새 공지사항을 작성하면 이곳에 표시됩니다.'
  />
);

export const NoticeListSearchEmptyState = ({ query }: { query: string }) => (
  <NoticeListState
    icon={
      <SearchIcon
        className='size-5'
        aria-hidden='true'
      />
    }
    title='검색 결과가 없습니다.'
    description={`"${query}"에 대한 공지사항을 찾을 수 없습니다.`}
  />
);
