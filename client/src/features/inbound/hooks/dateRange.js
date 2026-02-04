// @ts-check

/** @param {Date} d */
export function formatDateYMD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** @param {string} ymd */
export function parseYMD(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/**
 * from~to 가 1년(365일) 초과인지 검사
 * @param {Date} from
 * @param {Date} to
 */
export function isOverOneYear(from, to) {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  const diffDays = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return diffDays > 365;
}
