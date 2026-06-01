// @ts-check

/**
 * Hooks
 */
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useNoticeEditForm } from '@/features/notice/hooks/use-notice-edit-form';

/**
 * Components
 */
import { AppHeader } from '@/components/common/app-header.jsx';
import { NoticeContentSection } from '@/features/notice/components/notice-create/notice-content-section.jsx';
import { NoticeCreateHeaderActions } from '@/features/notice/components/notice-create/notice-create-header-actions.jsx';
import { NoticePinnedSection } from '@/features/notice/components/notice-create/notice-pinned-section.jsx';
import { NoticeReadonlyAttachmentsSection } from '@/features/notice/components/notice-create/notice-readonly-attachments-section.jsx';
import { NoticeTitleSection } from '@/features/notice/components/notice-create/notice-title-section.jsx';

/**
 * Api & Constants
 */
import { fetchNoticeById } from '@/features/notice/api';
import { CONTENT_MAX, TITLE_MAX } from '@/features/notice/constants';
import { Spinner } from '@/components/ui/spinner.js';

/**
 * @import { NoticeDetailType } from '@/features/notice/types/index.js';
 */

/**
 * @param {{ id: number, notice: NoticeDetailType }} props
 */
const NoticeEditContent = ({ id, notice }) => {
  const navigate = useNavigate();
  const form = useNoticeEditForm({
    id,
    initialValues: {
      title: notice.title,
      content: notice.content,
      pinned: notice.pinned,
    },
  });

  return (
    <form
      className='mx-auto max-w-300 px-5'
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <AppHeader
        title='공지사항 수정'
        description='제목과 내용을 수정한 뒤 저장하세요.'
        allowBackward
        asideDecoration={
          <NoticeCreateHeaderActions
            onCancel={() => navigate(`/dashboard/notice/${id}`)}
            isSubmitting={form.isSubmitting}
            submitLabel='저장'
            submittingLabel={<Spinner />}
          />
        }
      />

      <div className='space-y-5'>
        <NoticeTitleSection
          form={form}
          maxLength={TITLE_MAX}
        />

        <NoticeContentSection
          form={form}
          maxLength={CONTENT_MAX}
        />

        <NoticePinnedSection form={form} />

        <NoticeReadonlyAttachmentsSection attachments={notice.attachments} />
      </div>
    </form>
  );
};

export const NoticeEdit = () => {
  const { id } = useParams();
  const noticeId = Number(id);

  // 게시글 수정 정보 불러오기
  const { data: notice, isLoading } = useQuery({
    queryKey: ['notice', id],
    queryFn: () => fetchNoticeById(id),
  });

  if (isLoading) return <div className='p-6'>로딩중...</div>;
  if (!notice || !Number.isFinite(noticeId))
    return <div className='p-6'>게시글이 없습니다.</div>;

  return (
    <NoticeEditContent
      id={noticeId}
      notice={notice}
    />
  );
};
