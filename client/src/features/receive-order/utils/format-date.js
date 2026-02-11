/**
 * ISO 날짜로 변환
 * @param {Date} date 
 */
export const formatToIsoDate = (date) => {
  if (!date) return;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${yyyy}-${mm}-${dd}`
  return formattedDate
}