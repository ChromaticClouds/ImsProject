import { notices as seed } from '@/features/notice/mocks/notice-mock';

 // 🔄 나중에 Spring API로 교체  --> 코드 맞는지 다시 체크 해봐야함 (왜냐면 리턴값)
// const res = await fetch('http://localhost:8080/api/notices');
// return res.json();


// 메모리 스토어(새로고침하면 seed로 초기화됨)
// 원하면 localStorage로 바꿔줄 수도 있어
let store = [...seed];

const PINNED_LIMIT = 3;

export const fetchNotices = async () => {
  return store;
};

export const fetchNoticeById = async (id) => {
  const num = Number(id);
  return store.find((n) => n.id === num) ?? null;
};

export const createNotice = async (payload) => {
  // payload: { userId, title, content, pinned, createdAt, fileName? }
  const title = (payload?.title ?? '').trim();
  const content = (payload?.content ?? '').trim();

  if (!title || !content) {
    return { ok: false, message: '미입력되었습니다' };
  }

  if (payload.pinned) {
    const pinnedCount = store.filter((n) => n.pinned).length;
    if (pinnedCount >= PINNED_LIMIT) {
      return { ok: false, message: '중요 게시글의 개수가 초과되었습니다' };
    }
  }

  const nextId = store.length ? Math.max(...store.map((n) => n.id)) + 1 : 1;

  const newNotice = {
    id: nextId,
    userId: payload.userId ?? 'admin',
    title,
    content,
    pinned: !!payload.pinned,
    createdAt: payload.createdAt ?? new Date().toISOString().slice(0, 10),
    fileName: payload.fileName ?? null,
  };

  store = [newNotice, ...store]; // 최신 글 위로
  return { ok: true, message: '등록되었습니다', notice: newNotice };
};

export const updateNotice = async (id, payload) => {
  const num = Number(id);
  const idx = store.findIndex((n) => n.id === num);
  if (idx === -1) return { ok: false, message: '게시글이 없습니다' };

  const title = (payload?.title ?? '').trim();
  const content = (payload?.content ?? '').trim();
  if (!title || !content) return { ok: false, message: '미입력되었습니다' };

  // pinned 3개 제한: "현재 글"이 pinned인지 고려해서 계산
  const current = store[idx];
  const willPinned = !!payload.pinned;

  if (willPinned) {
    const pinnedCount = store.filter((n) => n.pinned).length;
    const isCurrentlyPinned = !!current.pinned;
    const nextPinnedCount = isCurrentlyPinned ? pinnedCount : pinnedCount + 1;

    if (nextPinnedCount > PINNED_LIMIT) {
      return { ok: false, message: '중요 게시글의 개수가 초과되었습니다' };
    }
  }

  const updated = {
    ...current,
    title,
    content,
    pinned: willPinned,
    fileName: payload.fileName ?? current.fileName ?? null,
  };

  store = store.map((n) => (n.id === num ? updated : n));
  return { ok: true, message: '수정되었습니다', notice: updated };
};

export const deleteNotice = async (id) => {
  const num = Number(id);
  const exists = store.some((n) => n.id === num);
  if (!exists) return { ok: false, message: '게시글이 없습니다' };

  store = store.filter((n) => n.id !== num);
  return { ok: true, message: '삭제 완료 되었습니다.' };
};
