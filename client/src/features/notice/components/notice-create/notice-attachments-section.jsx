import { FileDropZone } from '@/features/notice/components/notice-create/file-drop-zone.js';
import { PaperclipIcon } from 'lucide-react';

/**
 * @param {{ form: ReturnType<import('@/features/notice/hooks/use-notice-form').useNoticeForm> }} props
 */
export const NoticeAttachmentsSection = ({ form }) => {
  return (
    <div className='space-y-1.5'>
      <div className='flex items-center gap-1.5'>
        <PaperclipIcon
          className='size-4 text-muted-foreground'
          aria-hidden='true'
        />
        <span className='text-sm font-medium'>첨부파일</span>
        <span className='text-xs text-muted-foreground'>(선택)</span>
      </div>
      <FileDropZone form={form} />
    </div>
  );
};
