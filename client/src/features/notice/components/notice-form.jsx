// @ts-check
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

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
 *   onCancel: () => void,
 *   onSubmit: (values: FormData) => void,
 *   isSubmitting?: boolean,
 * }} props
 */
export const NoticeForm = ({
  mode,
  initialValues,
  onCancel,
  onSubmit,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [pinned, setPinned] = useState(!!initialValues?.pinned);
  const [fileName, setFileName] = useState(initialValues?.fileName ?? null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const frm = document.forms.namedItem('frm');

    //FormData 객체 생성 --> frm 요소를 이용하여 FormData 객체 생성
    const data = new FormData(frm);
    data.set('pinned', pinned ? 'true' : 'false');

    console.log('data', frm);

    const t = title.trim();
    const c = content.trim();

    if (!t || !c) {
      toast.error('미입력되었습니다');
      return;
    }

    console.log(`onSubmit
      title: ${t},
      content: ${c},
      ${pinned},
      ${fileName},
    `);

    onSubmit(data);
  };

  return (
    <div className='space-y-4'>
      <form
        method='post'
        name='frm'
        encType='multipart/form-data'
        className='space-y-2'
      >
        <Input
          placeholder='제목'
          name='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className='w-full min-h-60 rounded-md border p-3 text-sm'
          placeholder='내용'
          name='content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className='flex items-center gap-2'>
          <Checkbox
            name='pinned'
            checked={pinned}
            onCheckedChange={(v) => setPinned(!!v)}
          />
          <span className='text-sm'>중요 공지(공지 태그)</span>
        </div>

        <div className='text-sm space-y-2'>
          <div>첨부파일</div>
          <input
            name='upff'
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
          <Button
            variant='outline'
            type='button'
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {mode === 'create' ? '등록' : '수정완료'}
          </Button>
        </div>
      </form>
    </div>
  );
};
