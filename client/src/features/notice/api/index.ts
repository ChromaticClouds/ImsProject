// @ts-check

import { api } from '@/services/api.js';
import { NoticeDetailType } from '@/features/notice/types';

export type PinnedNoticeSummary = {
  id: number;
  title: string;
  author?: {
    id?: number;
    name?: string;
    eid?: string;
    email?: string;
  } | null;
};

export const getNotices = (
  page = 1,
  search = '',
): Promise<NoticeListResponse> =>
  api
    .get('notice/list', {
      searchParams: {
        page,
        ...(search.trim() ? { search: search.trim() } : {}),
      },
    })
    .json();

export const fetchNoticeById = async (id?: string) =>
  api.get(`notice/${id}`).json<NoticeDetailType>();

export const getPinnedNotices = () =>
  api.get('notice/pinned').json<PinnedNoticeSummary[]>();

export const createNotice = async (formData: FormData) =>
  api.post('notice/post', { body: formData }).json<ApiResponse>();

export const updateNotice = async (id: number, formData: FormData) =>
  api.patch(`notice/${id}`, { body: formData }).json<ApiResponse>();

export const deleteNotice = (id?: string) =>
  api.delete(`notice/${id}`).json<ApiResponse>();

export const updatePinned = (id: string, pinned: boolean) =>
  api.patch(`notice/${id}/pinned`, { searchParams: { pinned } }).json();
