/**
 * @param {number} current
 * @param {number} total
 * @param {number} [windowSize] - 가운데 보여줄 개수(홀수 권장, 기본 5)
 */
export const getEllipsisPages = (
  current,
  total,
  windowSize = 5,
) => {
  if (total <= 0) return [];

  const pages = [];
  const half = Math.floor(windowSize / 2);

  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);

  // 범위 보정
  if (start <= 2) {
    start = 1;
    end = Math.min(total, windowSize);
  }

  if (end >= total - 1) {
    end = total;
    start = Math.max(1, total - windowSize + 1);
  }

  // 첫 페이지
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('...');
  }

  // 중앙 페이지들
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // 마지막 페이지
  if (end < total) {
    if (end < total - 1) pages.push('...');
    pages.push(total);
  }

  return pages;
};
