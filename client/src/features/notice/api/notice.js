import { api } from '@/services/api';
import { ERROR } from '@/services/error.js';
import Filesaver from 'file-saver';
import { HTTPError } from 'ky';
import { toast } from 'sonner';

export const fetchNotices = async () => api.get('notice/list').json();

export const downloadFile = async (fileName) => {
  try {
    const response = await api
      .post('notice/file/download', { json: { fileName } })
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
