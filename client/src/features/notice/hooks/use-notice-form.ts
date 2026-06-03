import z from 'zod';
import { noticeFormSchema } from '@/features/notice/schemas/notice-form-schema';
import { useAppForm } from '@/components/form';
import { useNoticeCreateMutation } from '@/features/notice/hooks/use-notice-create-mutation';
import { useEffect, useRef } from 'react';

export type NoticeFormValues = z.infer<typeof noticeFormSchema>;

const defaultValues: NoticeFormValues = {
  title: '',
  content: '',
  isPinned: false,
  attachments: [],
};

const toNoticeCreateFormData = (value: NoticeFormValues) => {
  const formData = new FormData();
  const { attachments, isPinned, title, content } = value;

  formData.append('title', title);
  formData.append('content', content);
  formData.append('pinned', String(isPinned));

  attachments.forEach((file) => {
    formData.append('attachments', file);
  });

  return formData;
};

type UseNoticeFormOptions = {
  getUnpinNoticeIds?: () => number[];
};

export const useNoticeForm = ({
  getUnpinNoticeIds = () => [],
}: UseNoticeFormOptions = {}) => {
  const createNotice = useNoticeCreateMutation();
  const getUnpinNoticeIdsRef = useRef(getUnpinNoticeIds);

  useEffect(() => {
    getUnpinNoticeIdsRef.current = getUnpinNoticeIds;
  }, [getUnpinNoticeIds]);

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: noticeFormSchema,
    },
    onSubmit: ({ value }) => {
      createNotice.mutate({
        formData: toNoticeCreateFormData(value),
        unpinNoticeIds: value.isPinned ? getUnpinNoticeIdsRef.current() : [],
      });
    },
  });

  return Object.assign(form, {
    isSubmitting: createNotice.isPending,
  });
};
