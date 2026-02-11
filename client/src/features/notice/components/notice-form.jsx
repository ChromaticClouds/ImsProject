// @ts-check
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

/**
 * @typedef {object} NoticeFormValues
 * @property {string} title
 * @property {string} content
 * @property {boolean} pinned
 * @property {string|null} fileName
 */

/**
 * @param {{
 *   mode: "create" | "edit",
 *   initialValues?: Partial<NoticeFormValues>,
 *   isAdmin?: boolean,
 *   onCancel: () => void,
 *   onSubmit: (values: NoticeFormValues) => void,
 *   isSubmitting?: boolean,
 * }} props
 */
export const NoticeForm = ({
  mode,
  initialValues,
  isAdmin = true,
  onCancel,
  onSubmit,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [pinned, setPinned] = useState(!!initialValues?.pinned);
  const [fileName, setFileName] = useState(initialValues?.fileName ?? null);

  const handleSubmit = () => {
    const t = title.trim();
    const c = content.trim();

    if (!t || !c) {
      window.alert('미입력되었습니다');
      return;
    }

    console.log(`onSubmit
      title: ${t},
      content: ${c},
      ${pinned},
      ${fileName},
      
      `)

    onSubmit({
      title: t,
      content: c,
      pinned,
      fileName,
    });
  };

  return (
    <div className='space-y-4'>
      <Input
        placeholder='제목'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className='w-full min-h-[240px] rounded-md border p-3 text-sm'
        placeholder='내용'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className='flex items-center gap-2'>
        <Checkbox
          checked={pinned}
          onCheckedChange={(v) => setPinned(!!v)}
          disabled={!isAdmin}
        />
        <span className='text-sm'>중요 공지(공지 태그)</span>
      </div>

      <div className='text-sm space-y-2'>
        <div>첨부파일</div>
        <input
          type='file'
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
        {fileName && (
          <div className='text-muted-foreground'>
            {mode === 'edit' ? `현재: ${fileName}` : `선택됨: ${fileName}`}
          </div>
        )}
      </div>

      <div className='flex justify-end gap-2 pt-2'>
        <Button variant='outline' onClick={onCancel}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={!isAdmin || isSubmitting}>
          {mode === 'create' ? '등록' : '수정완료'}
        </Button>
      </div>

        


    </div>
  );
};
