import { useState, useMemo } from 'react';

/**
 * 공지사항 검색 훅
 * - 제목
 * - 작성자(userId)
 */
export const useNoticeSearch = () => {
  const [keyword, setKeyword] = useState('');

  const applySearch = (list) => {
    if (!keyword.trim()) return list;

    return list.filter((notice) => {
      return (
        notice.title.includes(keyword) ||
        notice.userId.includes(keyword)
      );
    });
  };

  return {
    keyword,
    setKeyword,
    applySearch,
  };
};
