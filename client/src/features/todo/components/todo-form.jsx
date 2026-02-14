// @ts-check
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

import { useTodoTags } from '@/features/todo/hooks/use-todo-tags';

/**
 * @param {{
 *  mode?: 'create'|'edit',
 *  initialValues?: {
 *    title?: string,
 *    description?: string,
 *    category?: string,
 *    startDate?: string,
 *    endDate?: string,
 *    tages?: string[],
 *  },
 *  onSubmit: (values: any) => void,
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
  const { tags, setTags, input, setInput, addTag, removeTag } = useTodoTags();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // ✅ edit일 때 초기값 주입
  useEffect(() => {
    if (!initialValues) return;
    setTitle(initialValues.title ?? '');
    setDescription(initialValues.description ?? '');
    setCategory(initialValues.category ?? '');
    setStartDate(initialValues.startDate ?? '');
    setEndDate(initialValues.endDate ?? '');
    setTags(Array.isArray(initialValues.tages) ? initialValues.tages : []);
  }, [initialValues, setTags]);

  const handleSubmit = () => {
    if (!title.trim() || !startDate || !endDate) {
      alert('필수 항목을 입력하세요.');
      return;
    }
    if (startDate > endDate) {
      alert('종료 날짜는 시작 날짜보다 빠를 수 없습니다.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description,
      category: category.trim(),
      startDate,
      endDate,
      tages: tags,
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
