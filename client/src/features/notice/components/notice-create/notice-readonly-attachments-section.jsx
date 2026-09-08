import { Button } from '@/components/ui/button.js';
import { downloadFile } from '@/features/notice/api/notice.js';
import { PaperclipIcon } from 'lucide-react';

const getFileName = (path) => path?.split('/').pop() ?? path;

/**
 * @param {{ attachments?: string[] }} props
 */
export const NoticeReadonlyAttachmentsSection = ({ attachments = [] }) => {
  if (attachments.length === 0) return null;

  return (
    <div className='space-y-1.5'>
      <div className='flex items-center gap-1.5'>
        <PaperclipIcon
          className='size-4 text-muted-foreground'
          aria-hidden='true'
        />
        <span className='text-sm font-medium'>첨부파일</span>
        <span className='text-xs text-muted-foreground'>(수정 불가)</span>
      </div>

      <div className='rounded-md border bg-muted/30 px-3 py-2'>
        <div className='flex flex-col items-start gap-1'>
          {attachments.map((fileName) => {
            const displayName = getFileName(fileName);
            return (
              <Button
                key={fileName}
                type='button'
                variant='link'
                className='h-auto p-0 text-sm'
                onClick={async () => {
                  await downloadFile(fileName);
                }}
              >
                {displayName.length >= 80
                  ? `${displayName.slice(0, 80)}...`
                  : displayName}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
