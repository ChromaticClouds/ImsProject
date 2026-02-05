import { useState } from 'react';

export const useNoticeSearch = () => {
  const [keyword, setKeyword] = useState('');

  const applySearch = (list) => {
    if (!keyword.trim()) return list;

    return list.filter(
      (notice) =>
        notice.title.includes(keyword) ||
        notice.userId.includes(keyword)
    );
  };

  return {
    keyword,
    setKeyword,
    applySearch,
  };
};
