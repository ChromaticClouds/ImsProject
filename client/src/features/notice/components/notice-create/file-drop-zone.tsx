import { AttachedFileList } from '@/features/notice/components/notice-create/attaced-file-list';
import { ACCEPTED_TYPES } from '@/features/notice/constants';
import { UploadCloudIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import type { useNoticeForm } from '@/features/notice/hooks/use-notice-form';

type FileDropZoneType = {
  form: ReturnType<typeof useNoticeForm>;
};

const getDropZoneClassName = (isDragging: boolean) =>
  [
    'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 transition-colors',
    isDragging
      ? 'border-primary bg-primary/5'
      : 'border-border hover:border-primary/50 hover:bg-muted/40',
  ].join(' ');

export const FileDropZone = ({ form }: FileDropZoneType) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openFileDialog = () => inputRef.current?.click();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <form.AppField
      name='attachments'
      mode='array'
    >
      {(field) => {
        const files = field.state.value ?? [];

        return (
          <div className='space-y-2'>
            <div
              role='button'
              tabIndex={0}
              aria-label='파일 첨부 영역. 클릭하거나 파일을 드래그하세요.'
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);

                const droppedFiles = Array.from(e.dataTransfer.files);
                droppedFiles.forEach((file) => field.pushValue(file));
              }}
              onClick={openFileDialog}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openFileDialog();
              }}
              className={getDropZoneClassName(isDragging)}
            >
              <UploadCloudIcon
                className={[
                  'size-7 transition-colors',
                  isDragging ? 'text-primary' : 'text-muted-foreground',
                ].join(' ')}
                aria-hidden='true'
              />
              <div className='text-center'>
                <p className='text-sm font-medium'>
                  클릭하거나 파일을 여기에 끌어다 놓으세요
                </p>
                <p className='mt-0.5 text-xs text-muted-foreground'>
                  이미지, PDF, 문서, 압축파일 지원
                </p>
              </div>
              <input
                ref={inputRef}
                type='file'
                multiple
                accept={ACCEPTED_TYPES}
                className='sr-only'
                aria-hidden='true'
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files) return;

                  Array.from(files).forEach((file) => field.pushValue(file));
                  e.target.value = '';
                }}
              />
            </div>

            <AttachedFileList
              files={files}
              onRemove={(index) => field.removeValue(index)}
            />
          </div>
        )
      }}
    </form.AppField>
  );
};
