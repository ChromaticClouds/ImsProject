// @ts-check
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { NoticeAttachmentsSection } from '@/features/notice/components/notice-detail/notice-attachments-section.jsx';
import { NoticeContentSection } from '@/features/notice/components/notice-detail/notice-content-section.jsx';
import { NoticeDetailHeader } from '@/features/notice/components/notice-detail/notice-detail-header.jsx';
import { NoticeNavigationPreview } from '@/features/notice/components/notice-detail/notice-navigation-preview.jsx';

import { fetchNoticeById } from '@/features/notice/api';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';
import { useNoticeDeleteMutation } from '@/features/notice/hooks/use-notice-delete-mutation.js';

/**
 * @returns {import('react').ReactElement}
 */
export const NoticeDetail = () => {
  /**
   * User authStore
   */
  const user = useAuthStore((s) => s.user);

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: notice, isLoading } = useQuery({
    queryKey: ['notice', id],
    queryFn: () => fetchNoticeById(id),
  });

  const del = useNoticeDeleteMutation(id);

  if (isLoading) return <div className='p-6'>로딩중...</div>;
  if (!notice) return <div className='p-6'>게시글이 없습니다.</div>;

  const isAuthorized = user?.eid === notice?.author?.eid;

  const attachments = notice.attachments ?? [];
  const canManage = user?.userRank === 'FIRST_ADMIN';
  const goNoticeList = () => navigate('/dashboard/notice');

  return (
    <div className='mx-auto max-w-300 px-5'>
      <NoticeDetailHeader
        notice={notice}
        canManage={canManage}
        isDeleting={del.isPending}
        isAuthorized={isAuthorized}
        onBack={goNoticeList}
        onDelete={() => del.mutate()}
        onEdit={() => navigate(`/dashboard/notice/${id}/edit`)}
      />

      <main className='space-y-10'>
        <NoticeContentSection content={notice.content} />

        <NoticeAttachmentsSection attachments={attachments} />

        <NoticeNavigationPreview
          previousNotice={notice.previousNotice}
          nextNotice={notice.nextNotice}
          onMove={(noticeId) => navigate(`/dashboard/notice/${noticeId}`)}
        />
      </main>
    </div>
  );
};
