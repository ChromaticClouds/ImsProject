import { api } from "@/services/api";

// export const fetchNotice = () => {
//   console.log("notice.js 진입")  
//   return api.get('api/notices/list').json()
// };

export const fetchNotices = async () => {
  const res = await fetch('/api/notice/list');

  if (!res.ok) {
    throw new Error('공지 목록 조회 실패');
  }

  return res.json();
};