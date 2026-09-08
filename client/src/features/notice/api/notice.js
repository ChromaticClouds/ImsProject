import { api } from '@/services/api';
import { ERROR } from '@/services/error.js';
import Filesaver from 'file-saver';
import { HTTPError } from 'ky';
import { toast } from 'sonner';

export const fetchNotices = async () => api.get('notice/list').json();

export const downloadFile = async (fileName) => {
  try {
    const response = await api.post('notice/file/download', {
      json: { fileName },
    });
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const { url } = await response.json();
      if (typeof url !== 'string' || url.length === 0) {
        return toast.error(ERROR.UNEXPECTED_ERROR);
      }
      window.location.assign(url);
      return;
    }

    const file = await response.blob();
    const downloadName = fileName.split('/').pop() || fileName;
    Filesaver.saveAs(file, downloadName);
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
