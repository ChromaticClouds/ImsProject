import type { ReactNode } from 'react';

export type NoticeListItem = {
  id: number;
  title: string;
  pinned: boolean;
  createdAt: string;
  hasAttachment: boolean;
  author?: {
    id?: number;
    eid?: string;
    name: string;
    email?: string;
  } | null;
  userName?: string;
};

export type NoticeListViewProps = {
  pinned: NoticeListItem[];
  items: NoticeListItem[];
  page?: number;
  totalPages?: number;
  searchValue?: string;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: string | boolean;
  canCreate?: boolean;
  onCreate?: () => void;
  onSelectNotice?: (id: NoticeListItem['id']) => void;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
};

export type NoticeListStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};
