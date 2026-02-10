// @ts-check

const BASE_URL = 'http://localhost:8080/api/notice';

// 서버(언더바) -> 프론트(camelCase)
const fromServer = (n) => ({
  id: n.id,
  userId: n.user_id,
  title: n.title,
  content: n.content,
  pinned: !!n.pinned,
  createdAt: n.created_at,
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
export const fetchNoticessssss = async () => {
  const res = await fetch(`${BASE_URL}/list`);
  if (!res.ok) throw new Error('공지 목록 조회 실패');

  const data = await res.json(); // [{...}]
  return data.map(fromServer);
};

/**
 * 공지 상세
 * GET /api/notice/{id}
 */
export const fetchNoticeById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
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
  const title = (values?.title ?? '').trim();
  const content = (values?.content ?? '').trim();

  if (!title || !content) {
    return { ok: false, message: '미입력되었습니다' };
  }

  const form = new FormData();
  form.append(
    'notice',
    new Blob(
      [
        JSON.stringify({
          user_id: values.userId,
          title : values.title,
          content: values.content,
          pinned: !!values.pinned,
        }),
      ],
      { type: 'application/json' }
    )
  );

  if (values?.file) form.append('file', values.file);

  const res = await fetch(`${BASE_URL}/post`, {
    method: 'POST',
    body: form,
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
export const updateNotice = async (id, values) => {
  const title = (values?.title ?? '').trim();
  const content = (values?.content ?? '').trim();

  if (!title || !content) {
    return { ok: false, message: '미입력되었습니다' };
  }

  const form = new FormData();
  form.append(
    'notice',
    new Blob(
      [
        JSON.stringify({
          // user_id는 수정에 필수 아니면 빼도 됨
          title,
          content,
          pinned: !!values.pinned,
          // file_name은 서버에서 파일 업로드 시 덮어쓰게 두는 걸 추천
          // 필요하면 내려보낼 수는 있음:
          file_name: values.fileName ?? null,
        }),
      ],
      { type: 'application/json' }
    )
  );

  // 새 파일을 선택한 경우에만 첨부
  if (values?.file) form.append('file', values.file);

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH', // 서버를 PATCH로 만들면 그대로 사용
    body: form,
  });

  return res.json();
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
