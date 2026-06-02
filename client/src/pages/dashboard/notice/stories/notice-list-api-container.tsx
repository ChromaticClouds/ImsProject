import { getNotices } from '@/features/notice/api';
import { NoticeListView } from '@/features/notice/components/notice-list-view/notice-list-view';
import type {
  NoticeListItem,
  NoticeListViewProps,
} from '@/features/notice/components/notice-list-view/notice-list-types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type ApiNotice = Notice & {
  author?: NoticeListItem['author'];
  userName?: string;
};

type NoticeListApiContainerProps = Omit<
  NoticeListViewProps,
  'pinned' | 'items' | 'page' | 'totalPages' | 'isLoading' | 'error'
> & {
  initialPage?: number;
};

const toNoticeListItem = (notice: ApiNotice): NoticeListItem => ({
  id: notice.id,
  title: notice.title,
  pinned: notice.pinned,
  createdAt: notice.createdAt,
  hasAttachment: notice.hasAttachment,
  author: notice.author ?? (notice.userName ? { name: notice.userName } : null),
  userName: notice.userName,
});

export const NoticeListApiContainer = ({
  initialPage = 1,
  onPageChange,
  ...props
}: NoticeListApiContainerProps) => {
  const [params] = useSearchParams();
  const searchValue = params.get('search') ?? '';
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  const {
    data,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['storybook-notices', page, searchValue],
    queryFn: () => getNotices(page, searchValue),
  });

  const pinned = data?.pinned.map((notice) =>
    toNoticeListItem(notice as ApiNotice),
  ) ?? [];
  const items = data?.items.map((notice) =>
    toNoticeListItem(notice as ApiNotice),
  ) ?? [];

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    onPageChange?.(nextPage);
  };

  return (
    <NoticeListView
      {...props}
      pinned={pinned}
      items={items}
      page={data?.page ?? page}
      totalPages={data?.totalPages ?? 1}
      isLoading={isLoading}
      isFetching={isFetching}
      error={isError ? '서버와 연결할 수 없습니다.' : false}
      onPageChange={handlePageChange}
      onRetry={() => refetch()}
    />
  );
};
