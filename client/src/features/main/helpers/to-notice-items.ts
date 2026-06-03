export const toNoticeItems = (data?: NoticeListResponse) => {
  if (!data) return [];

  const notices = [
    ...(Array.isArray(data.pinned) ? data.pinned : []),
    ...(Array.isArray(data.items) ? data.items : []),
  ];

  return notices.map((notice) => ({
    id: notice.id,
    title: notice.title ?? '제목 없음',
    date: notice.createdAt ? String(notice.createdAt).slice(0, 10) : '',
    isPinned: !!notice.pinned,
    hasAttachment: !!notice.hasAttachment,
  }));
};
