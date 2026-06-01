import type { useAppForm } from '@/components/form';

export type NoticeFormController = ReturnType<typeof useAppForm>;

export type NoticeDetailType = {
  id: number;
  userId: number;
  userName: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  attachments: string[];
  author: { id: number; name: string; email: string };
  previousNotice: { id: number; title: string } | null;
  nextNotice: { id: number; title: string } | null;
};

export { };
