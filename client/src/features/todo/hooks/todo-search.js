import { useState } from 'react';

export const useTodoSearch = () => {
  const [keyword, setKeyword] = useState('');

  const applySearch = (list = []) => {
    const safeList = Array.isArray(list) ? list : [];
    const k = keyword.trim();
    if (!k) return safeList;

    return safeList.filter((t) => {
      const title = t?.title ?? '';
      const desc = t?.description ?? '';
      const userId = t?.userId ?? '';
      const tages = Array.isArray(t?.tages) ? t.tages.join(' ') : '';

      return (
        title.includes(k) ||
        desc.includes(k) ||
        userId.includes(k) ||
        tages.includes(k)
      );
    });
  };

  return { keyword, setKeyword, applySearch };
};
