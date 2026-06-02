import { NoticeListRow } from '@/features/notice/components/notice-list-view/notice-list-row';
import {
  NoticeListEmptyState,
  NoticeListErrorState,
  NoticeListLoadingState,
  NoticeListSearchEmptyState,
} from '@/features/notice/components/notice-list-view/notice-list-state';
import type { NoticeListItem } from '@/features/notice/components/notice-list-view/notice-list-types';

type NoticeListContentProps = {
  notices: NoticeListItem[];
  searchValue: string;
  isLoading: boolean;
  error?: string | boolean;
  onSelectNotice?: (id: NoticeListItem['id']) => void;
  onRetry?: () => void;
};

export const NoticeListContent = ({
  notices,
  searchValue,
  isLoading,
  error,
  onSelectNotice,
  onRetry,
}: NoticeListContentProps) => {
  const trimmedSearchValue = searchValue.trim();
  const isSearchEmpty = trimmedSearchValue.length > 0 && notices.length === 0;

  if (isLoading) {
    return <NoticeListLoadingState />;
  }

  if (error) {
    return (
      <NoticeListErrorState
        message={typeof error === 'string' ? error : undefined}
        onRetry={onRetry}
      />
    );
  }

  if (isSearchEmpty) {
    return <NoticeListSearchEmptyState query={trimmedSearchValue} />;
  }

  if (notices.length === 0) {
    return <NoticeListEmptyState />;
  }

  return notices.map((notice) => (
    <NoticeListRow
      key={notice.id}
      notice={notice}
      onSelectNotice={onSelectNotice}
    />
  ));
};
