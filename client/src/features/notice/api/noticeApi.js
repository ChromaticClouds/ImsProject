// @ts-check

import { useAuthStore } from '@/features/auth/stores/use-auth-store';
import { api } from '@/services/api';

const BASE_URL = 'http://localhost:8080/api/notice';

// 서버(언더바) -> 프론트(camelCase)
const fromServer = (n) => ({
  id: n.id,
  userId: n.user_id??n.userId,
  title: n.title,
  content: n.content,
  pinned: !!n.pinned,
  createdAt: n.created_at??n.createdAt,
  fileName: n.file_name, // file_name(경로) -> fileName
});

// 프론트(camelCase) -> 서버(언더바)
const toServer = (p) => ({
  user_id: p.userId,
  title: p.title,
  content: p.content,
  pinned: !!p.pinned,
  file_name: p.fileName ?? null,
});

/**
 * 공지 목록
 * GET /api/notice/list
 */

/** @returns {Promise<NoticeListResponse>} */
export const getNotices = (page = 1) =>
  api.get('api/notice/list', { searchParams: { page } }).json();

/**
 * 공지 상세
 * GET /api/notice/{id}
 */
export const fetchNoticeById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  console.log(res)
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('공지 상세 조회 실패');

  const data = await res.json(); // {...}
  return fromServer(data);
};

/**
 * 공지 등록 (multipart)
 * POST /api/notice/post
 *
 * values: { userId?, title, content, pinned, file? }
 * - file은 NoticeForm에서 File 객체로 받아온다고 가정
 */
export const createNotice = async (values) => {

  console.log('createNotice : ', values)
  // const title = (values?.title ?? '').trim();
  // const content = (values?.content ?? '').trim();

  // if (!title || !content) {
  //   return { ok: false, message: '미입력되었습니다' };
  // }

  // const form = new FormData();
  // form.append(
  //   'notice',
  //   new Blob(
  //     [
  //       JSON.stringify({
  //         user_id: values.userId,
  //         title: values.title,
  //         content: values.content,
  //         pinned: !!values.pinned,
  //       }),
  //     ],
  //     { type: 'application/json' },
  //   ),
  // );

 // if (values?.file) form.append('file', values.file);

  const accessToken = useAuthStore.getState().accessToken;

  const res = await fetch(`${BASE_URL}/post`, {
    method: 'POST',
    body: values.frmData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // 서버가 ApiResponse를 주는 구조 가정: { success/ok, message, ... }
  return res.json();
};

/**
 * ✅ 공지 수정 (multipart or json)
 *
 * NoticeEdit에서 updateNotice(id, values)로 호출함.
 * 서버 엔드포인트는 아래 중 하나로 맞추면 됨:
 * - PATCH /api/notice/{id}  (multipart)
 * - PUT   /api/notice/{id}  (multipart)
 *
 * 여기서는 "multipart" 기준으로 작성 (파일 교체 가능)
 */

/**
 * 
 * @param {number} id 
 * @param {import('../components/notice-form').NoticeFormValues} values 
 */


/**
 * @param {number} id
 * @param {{
 *   title: string;
 *   content: string;
 *   pinned: boolean;
 *   file?: File | null;
 *   fileName?: string | null;
 * }} values
 * @returns {Promise<{ ok: boolean; message?: string }>}
 */
export const updateNotice = async (id, values) => {
  console.log("updateNotice : ", id, values)
  const title = (values?.title ?? '').trim();
  const content = (values?.content ?? '').trim();

  if (!title || !content) {
    return { ok: false, message: '미입력되었습니다' };
  }

  const form = new FormData();

  // JSON 부분
  form.append(
    'notice',
    new Blob(
      [
        JSON.stringify({
          title,
          content,
          oldPinned : !!values.oldPinned,
          pinned: !!values.pinned,
          fileName: values.fileName ?? null,
        }),
      ],
      { type: 'application/json' },
    ),
  );

  // 파일이 있을 경우만 추가
  if (values.file instanceof File) {
    form.append('file', values.file);
  }

  try {
    const response = await api.patch(`api/notice/${id}`, { body: form }).json();

    return response;
  } catch (error) {
    console.error(error);
    return { ok: false, message: '서버 오류가 발생했습니다' };
  }
};

/**
 * 공지 삭제
 * DELETE /api/notice/{id}
 */
export const deleteNotice = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  return res.json();
};

/**
 * 고정 토글
 * PATCH /api/notice/{id}/pinned?pinned=true
 */
export const updatePinned = async (id, pinned) => {
  const res = await fetch(`${BASE_URL}/${id}/pinned?pinned=${pinned}`, {
    method: 'PATCH',
  });

  return res.json();
};
