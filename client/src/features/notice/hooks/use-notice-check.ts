import { getPinnedNotices, PinnedNoticeSummary } from '@/features/notice/api';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useNoticeCheck = (
  checked: boolean,
  pinnedNotices?: PinnedNoticeSummary[],
) => {
  const [checkedPinnedNoticeIds, setCheckedPinnedNoticeIds] = useState<
    number[]
  >([]);

  useEffect(() => {
    if (!checked) return setCheckedPinnedNoticeIds([]);

    if (pinnedNotices)
      setCheckedPinnedNoticeIds(pinnedNotices.map((notice) => notice.id));
  }, [checked, pinnedNotices]);

  const checkedPinnedNoticeIdSet = useMemo(
    () => new Set(checkedPinnedNoticeIds),
    [checkedPinnedNoticeIds],
  );

  const getUnpinNoticeIds = useCallback(() => {
    if (!pinnedNotices) return [];

    return pinnedNotices
      .filter((notice) => !checkedPinnedNoticeIdSet.has(notice.id))
      .map((notice) => notice.id);
  }, [checkedPinnedNoticeIdSet, pinnedNotices]);

  const handlePinnedNoticeCheckedChange = useCallback(
    (id: number, isChecked: boolean) => {
      setCheckedPinnedNoticeIds((prev) => {
        if (isChecked) return prev.includes(id) ? prev : [...prev, id];
        return prev.filter((noticeId) => noticeId !== id);
      });
    },
    [],
  );

  return {
    checkedPinnedNoticeIds,
    getUnpinNoticeIds,
    handlePinnedNoticeCheckedChange,
  };
};
