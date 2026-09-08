// @ts-check
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

import { useTodoTags } from '@/features/todo/hooks/use-todo-tags';
import { toast } from 'sonner';

/**
 * @param {{
 *  mode?: 'create'|'edit',
 *  initialValues?: Partial<TodoUpdatePayload>,
 *  onSubmit: (values: TodoUpdatePayload) => void,
 *  onCancel: () => void,
 *  isSubmitting?: boolean,
 * }} props
 */
export const TodoForm = ({
  mode = 'create',
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { tags, input, setInput, addTag, removeTag } = useTodoTags(
    Array.isArray(initialValues?.tags) ? initialValues.tags : [],
  );

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? '');
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? '');

  const handleSubmit = () => {
    if (!title.trim() || !startDate || !endDate) {
      toast.warning('필수 항목을 입력하세요.');
      return;
    }
    if (startDate > endDate) {
      toast.error('종료 날짜는 시작 날짜보다 빠를 수 없습니다.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description,
      startDate,
      endDate,
      tags,
    });
  };

  return (
    <div className='space-y-4'>
      <Input
        disabled={isSubmitting}
        placeholder='업무 제목'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        disabled={isSubmitting}
        placeholder='업무 설명'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className='flex gap-2'>
        <Input
          disabled={isSubmitting}
          type='date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          disabled={isSubmitting}
          type='date'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className='flex gap-2'>
        <Input
          disabled={isSubmitting}
          placeholder='태그 입력'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTag();
          }}
        />
        <Button
          type='button'
          onClick={addTag}
          disabled={isSubmitting}
        >
          추가
        </Button>
      </div>

      <div className='flex gap-2 flex-wrap'>
        {tags.map((tag) => (
          <Badge
            key={tag}
            className='flex items-center gap-1'
          >
            {tag}
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeTag(tag);
              }}
              className='ml-1'
            >
              <X className='w-3 h-3 cursor-pointer' />
            </button>
          </Badge>
        ))}
      </div>

      <div className='flex justify-end gap-2 pt-4'>
        <Button
          variant='outline'
          onClick={onCancel}
          disabled={isSubmitting}
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
    </div>
  );
};
