// @ts-check

/**
 * Components
 */
import { AppHeader } from '@/components/common/app-header.jsx';
import { NoticeAttachmentsSection } from '@/features/notice/components/notice-create/notice-attachments-section.jsx';
import { NoticeContentSection } from '@/features/notice/components/notice-create/notice-content-section.jsx';
import { NoticeCreateHeaderActions } from '@/features/notice/components/notice-create/notice-create-header-actions.jsx';
import { NoticePinnedSection } from '@/features/notice/components/notice-create/notice-pinned-section.jsx';
import { NoticeTitleSection } from '@/features/notice/components/notice-create/notice-title-section.jsx';
import { useNoticeForm } from '@/features/notice/hooks/use-notice-form.js';

/**
 * Constants
 */
import { CONTENT_MAX, TITLE_MAX } from '@/features/notice/constants';

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner.js';

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────

/**
 * @typedef {object} NoticeFormValues
 * @property {string} title
 * @property {string} content
 * @property {boolean} isPinned
 * @property {File[]} attachments
 */

/**
 */
export const NoticeCreate = () => {
  const navigate = useNavigate();
  const form = useNoticeForm();

  return (
    <form
      className='mx-auto max-w-300 px-5'
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <AppHeader
        title='공지사항 작성'
        description={
          <>
            제목과 내용을 입력한 뒤 등록하세요.{' '}
            <span
              className='text-orange-500'
              aria-hidden='true'
            >
              *
            </span>
            <span> 표시는 필수 입력입니다.</span>
          </>
        }
        allowBackward
        asideDecoration={
          <NoticeCreateHeaderActions
            onCancel={() => navigate('/dashboard/notice')}
            isSubmitting={form.isSubmitting}
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

        <NoticeAttachmentsSection form={form} />
      </div>
    </form>
  );
};
