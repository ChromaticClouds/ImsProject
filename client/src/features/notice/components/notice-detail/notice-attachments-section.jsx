// @ts-check

import { NoticeAttachmentItem } from '@/features/notice/components/notice-detail/notice-attachment-item.jsx';
import { FileIcon } from 'lucide-react';

/**
 * @typedef {object} NoticeAttachmentsSectionProps
 * @property {string[]} attachments
 */

/**
 * @param {NoticeAttachmentsSectionProps} props
 */
export const NoticeAttachmentsSection = ({ attachments }) => {
  if (attachments.length === 0) return null;

  return (
    <section className='space-y-3'>
      <div className='flex items-center gap-2 text-sm font-medium'>
        <FileIcon
          className='size-4 text-muted-foreground'
          aria-hidden='true'
        />
        첨부파일
        <span className='text-muted-foreground'>{attachments.length}개</span>
      </div>
      <div className='space-y-2'>
        {attachments.map((fileName) => (
          <NoticeAttachmentItem
            key={fileName}
            fileName={fileName}
          />
        ))}
      </div>
      <p className='text-xs text-muted-foreground'>
        ※ 첨부파일은 수정 시 변경할 수 없습니다.
      </p>
    </section>
  );
};
