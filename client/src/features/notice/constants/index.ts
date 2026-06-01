import { noticeFormSchema } from "@/features/notice/schemas/notice-form-schema";

export const TITLE_MAX = noticeFormSchema.shape.title.maxLength!;
export const CONTENT_MAX = noticeFormSchema.shape.content.maxLength!;
export const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.gif,.pdf,.zip,.doc,.docx,.xls,.xlsx';
