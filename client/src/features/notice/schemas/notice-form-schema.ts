import z from "zod";

export const noticeFormSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(40, '최대 40자까지만 입력 가능합니다.'),
  content: z
    .string()
    .min(1, '내용을 입력해주세요.')
    .max(2000, '최대 2000자까지만 입력 가능합니다.'),
  isPinned: z.boolean(),
  attachments: z.file().array(),
});
