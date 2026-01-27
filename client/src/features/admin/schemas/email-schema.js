import z from "zod";

export const emailSchema = z.email('유효한 이메일이 아닙니다.');