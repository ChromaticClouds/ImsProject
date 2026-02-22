import { api } from '@/services/api';
import { ERROR } from '@/services/error.js';
import Filesaver from 'file-saver';
import { HTTPError } from 'ky';
import { toast } from 'sonner';

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
  try {
    const response = await api
      .post('api/notice/file/download', { json: { fileName } })
      .blob();
    Filesaver.saveAs(response, fileName);
  } catch (err) {
    if (err instanceof HTTPError) {
      const errResposne = await err.response.json();

      return toast.error(
        typeof errResposne?.message === 'string'
          ? errResposne?.message
          : ERROR.UNEXPECTED_ERROR
      );
    }

    toast.error(ERROR.SERVER_ERROR);
  }
};
