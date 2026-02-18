// @ts-check

/**
 * pagination item이 -1인 경우 elipsis로 처리
 * @param {number} current 
 * @param {number} total 
 * @param {number} [windowSize] 
 */
export const getPagination = (current, total, windowSize = 5) => {
  if (!total || total <= 0) return [];

  const size = Math.max(1, windowSize);
  const half = Math.floor(size / 2);

  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  // 윈도우 크기 맞추기
  const need = size - (end - start + 1);
  if (need > 0) {
    start = Math.max(2, start - need);
    end = Math.min(total - 1, end + (size - (end - start + 1)));
  }

  const items = [1];

  if (start > 2) items.push(-1);

  for (let i = start; i <= end; i++) items.push(i);

  if (end < total - 1) items.push(-1);

  if (total > 1) items.push(total);

  return items;
};
