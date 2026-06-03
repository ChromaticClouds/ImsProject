// @ts-check

import { AppHeader } from '@/components/common/app-header.jsx';
import { NoticeDetailActions } from '@/features/notice/components/notice-detail/notice-detail-actions.jsx';
import { NoticeDetailTitle } from '@/features/notice/components/notice-detail/notice-detail-title.jsx';
import { NoticeMeta } from '@/features/notice/components/notice-detail/notice-meta.jsx';
import { CalendarIcon, UserRoundIcon } from 'lucide-react';

/**
 * @import { NoticeDetailType } from '@/features/notice/types';
 */

/**
 * @typedef {object} NoticeDetailHeaderProps
 * @property {NoticeDetailType} notice
 * @property {boolean} canManage
 * @property {boolean} isDeleting
 * @property {boolean} isAuthorized
 * @property {() => void} onBack
 * @property {() => void} onDelete
 * @property {() => void} onEdit
 */

/**
 * @param {NoticeDetailHeaderProps} props
 */
export const NoticeDetailHeader = ({
  notice,
  canManage,
  isDeleting,
  isAuthorized,
  onBack,
  onDelete,
  onEdit,
}) => (
  <AppHeader
    allowBackward
    onBackward={onBack}
    title={
      <NoticeDetailTitle
        pinned={notice.pinned}
        title={notice.title}
      />
    }
    description={
      <span className='flex flex-wrap items-center gap-3'>
        <NoticeMeta icon={CalendarIcon}>{notice.createdAt}</NoticeMeta>
        {(notice.author?.name || notice.userName) && (
          <NoticeMeta icon={UserRoundIcon}>
            {notice.author?.name ?? notice.userName}
          </NoticeMeta>
        )}
      </span>
    }
    asideDecoration={
      <NoticeDetailActions
        canManage={canManage}
        isDeleting={isDeleting}
        isAuthorized={isAuthorized}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    }
  />
);
