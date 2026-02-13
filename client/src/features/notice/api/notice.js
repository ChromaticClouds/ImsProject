import { api } from '@/services/api';
import Filesaver from 'file-saver';

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

export const downloadFile = async (fileName) => {
  const response = await api
    .post('api/notice/file/download', { json: { fileName } }).blob();
  Filesaver.saveAs(response, fileName);
};
