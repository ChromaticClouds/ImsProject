// @ts-check

import { api } from '@/services/api';
import { HTTPError } from 'ky';

const fromServer = (notice) => ({
  id: notice.id,
  userId: notice.user_id ?? notice.userId,
  title: notice.title,
  content: notice.content,
  pinned: !!notice.pinned,
  createdAt: notice.created_at ?? notice.createdAt,
  fileName: notice.fileName,
});

/** @returns {Promise<NoticeListResponse>} */
export const getNotices = (page = 1) =>
  api.get('notice/list', { searchParams: { page } }).json();

export const fetchNoticeById = async (id) => {
  try {
    const data = await api.get(`notice/${id}`).json();
    return fromServer(data);
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 404) {
      return null;
    }

    throw error;
  }
};

export const createNotice = async (values) =>
  api.post('notice/post', { body: values.frmData }).json();

/**
 * @param {number} id
 * @param {{
 *   title: string;
 *   content: string;
 *   oldPinned: boolean;
 *   pinned: boolean;
 *   file?: File | null;
 *   fileName?: string | null;
 * }} values
 * @returns {Promise<ApiResponse>}
 */
export const updateNotice = async (id, values) => {
  const title = (values?.title ?? '').trim();
  const content = (values?.content ?? '').trim();

  if (!title || !content) {
    return { success: false, message: '필수 값을 입력해주세요.' };
  }

  const form = new FormData();
  form.append(
    'notice',
    new Blob(
      [
        JSON.stringify({
          title,
          content,
          oldPinned: !!values.oldPinned,
          pinned: !!values.pinned,
          fileName: values.fileName ?? null,
        }),
      ],
      { type: 'application/json' },
    ),
  );

  if (values.file instanceof File) {
    form.append('file', values.file);
  }

  try {
    return await api.patch(`notice/${id}`, { body: form }).json();
  } catch (error) {
    console.error(error);
    return { success: false, message: '서버 오류가 발생했습니다.' };
  }
};

export const deleteNotice = (id) => api.delete(`notice/${id}`).json();

export const updatePinned = (id, pinned) =>
  api.patch(`notice/${id}/pinned`, { searchParams: { pinned } }).json();
