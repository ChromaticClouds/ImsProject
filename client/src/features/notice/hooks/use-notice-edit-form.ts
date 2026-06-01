import z from 'zod';
import { noticeFormSchema } from '@/features/notice/schemas/notice-form-schema';
import { useAppForm } from '@/components/form';
import { useNoticeUpdateMutation } from '@/features/notice/hooks/use-notice-update-mutation';

export type NoticeEditFormValues = z.infer<typeof noticeFormSchema>;

type UseNoticeEditFormParams = {
  id: number;
  initialValues: {
    title: string;
    content: string;
    pinned: boolean;
  };
};

const toNoticeEditFormData = (value: NoticeEditFormValues) => {
  const formData = new FormData();
  formData.append(
    'notice',
    new Blob(
      [
        JSON.stringify({
          title: value.title.trim(),
          content: value.content.trim(),
          pinned: value.isPinned,
        }),
      ],
      { type: 'application/json' },
    ),
  );

  return formData;
};

export const useNoticeEditForm = ({
  id,
  initialValues,
}: UseNoticeEditFormParams) => {
  const updateNotice = useNoticeUpdateMutation();

  const form = useAppForm({
    defaultValues: {
      title: initialValues.title,
      content: initialValues.content,
      isPinned: initialValues.pinned,
      attachments: [],
    } as z.infer<typeof noticeFormSchema>,
    validators: {
      onChange: noticeFormSchema,
    },
    onSubmit: ({ value }) => {
      updateNotice.mutate({
        id,
        formData: toNoticeEditFormData(value),
      });
    },
  });

  return Object.assign(form, {
    isSubmitting: updateNotice.isPending,
  });
};
