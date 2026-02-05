import { useMemo, useState } from 'react';

export const TODO_STATUS_LABEL = {
  ALL: '전체',
  TODO: '미완료',
  IN_PROGRESS: '진행중',
  DONE: '완료',
};

export const TODO_SORT_LABEL = {
  END_DATE: '마감일 순(기본)',
  CREATED_AT: '등록일 순',
};

export const useTodoFilterSort = (list = []) => {
  const safeList = Array.isArray(list) ? list : [];
  const [status, setStatus] = useState('ALL');
  const [sort, setSort] = useState('END_DATE');

  const filteredSortedList = useMemo(() => {
    let result = safeList;

    // 필터(완료/진행중/전체)
    if (status !== 'ALL') {
      result = result.filter((t) => t?.status === status);
    }

    // 정렬(기본: 마감일 순 / 등록일 순)
    const toTime = (d) => (d ? new Date(d).getTime() : 0);

    result = [...result].sort((a, b) => {
      if (sort === 'CREATED_AT') return toTime(b.createdAt) - toTime(a.createdAt);
      return toTime(a.endDate) - toTime(b.endDate); // END_DATE
    });

    return result;
  }, [safeList, status, sort]);

  return {
    status,
    setStatus,
    sort,
    setSort,
    filteredSortedList,
  };
};
