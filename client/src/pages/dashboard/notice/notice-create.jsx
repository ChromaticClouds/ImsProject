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
import { PinnedNoticeSummaryList } from '@/features/notice/components/notice-create/pinned-notice-summary-list.jsx';
import { Spinner } from '@/components/ui/spinner.js';

/**
 * Hooks
 */
import { useNoticeForm } from '@/features/notice/hooks/use-notice-form.js';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

/**
 * Constants
 */
import { CONTENT_MAX, TITLE_MAX } from '@/features/notice/constants';
import { getPinnedNotices } from '@/features/notice/api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNoticeCheck } from '@/features/notice/hooks/use-notice-check.js';

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

  const [checked, setChecked] = useState(false);

  const {
    data: pinnedNotices,
    isError: isPinnedError,
    isFetching: isPinnedFetching,
  } = useQuery({
    queryKey: ['pinned', 'notice', 'summary'],
    queryFn: getPinnedNotices,
    enabled: checked,
  });

  const {
    checkedPinnedNoticeIds,
    getUnpinNoticeIds,
    handlePinnedNoticeCheckedChange,
  } = useNoticeCheck(checked, pinnedNotices);

  const form = useNoticeForm({ getUnpinNoticeIds });

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

        <NoticePinnedSection
          form={form}
          onCheckedChange={setChecked}
        />

        {checked && (
          <PinnedNoticeSummaryList
            notices={pinnedNotices}
            isLoading={isPinnedFetching}
            isError={isPinnedError}
            checkedIds={checkedPinnedNoticeIds}
            onCheckedChange={handlePinnedNoticeCheckedChange}
          />
        )}

        <NoticeAttachmentsSection form={form} />
      </div>
    </form>
  );
};
