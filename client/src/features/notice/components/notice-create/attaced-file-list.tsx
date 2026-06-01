import { FileIcon, XIcon } from "lucide-react";

type FileListItemType = {
  file: File;
  index: number;
  onRemove: (index: number) => void;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const FileListItem = ({ file, index, onRemove }: FileListItemType) => {
  return (
    <li className='flex items-center gap-2.5 rounded-md border bg-muted/30 px-3 py-2'>
      <FileIcon
        className='size-4 shrink-0 text-muted-foreground'
        aria-hidden='true'
      />
      <span className='min-w-0 flex-1 truncate text-sm'>{file.name}</span>
      <span className='shrink-0 text-xs text-muted-foreground'>
        {formatSize(file.size)}
      </span>
      <button
        type='button'
        aria-label={`${file.name} 삭제`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className='flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
      >
        <XIcon
          className='size-3.5'
          aria-hidden='true'
        />
      </button>
    </li>
  );
};

export const AttachedFileList = ({
  files,
  onRemove,
}: {
  files: File[];
  onRemove: (index: number) => void;
}) => {
  if (files.length === 0) return null;

  return (
    <ul
      className='space-y-1.5'
      aria-label='첨부된 파일 목록'
    >
      {files.map((file, index) => (
        <FileListItem
          key={`${file.name}-${index}`}
          file={file}
          index={index}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
};
