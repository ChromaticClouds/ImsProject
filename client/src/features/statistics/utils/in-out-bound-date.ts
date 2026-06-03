const pad2 = (n: number) => {
  return String(n).padStart(2, '0');
};

export const toYmd = (d: Date) => {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const startOfMonth = (d: Date) => {
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const isFutureYmd = (ymd: string) => {
  const today = toYmd(new Date());
  return String(ymd) > today;
};

const overOneYear = (from: string, to: string) => {
  const f = new Date(from);
  const t = new Date(to);
  const plus = new Date(f.getFullYear() + 1, f.getMonth(), f.getDate());

  return plus < t;
};

export const getDefaultInOutBoundDateRange = (today = new Date()) => {
  return {
    from: toYmd(startOfMonth(today)),
    to: toYmd(today),
  };
};

export const getInOutBoundDateError = (from: string, to: string) => {
  if (!from || !to) return '';

  if (String(from) > String(to)) {
    return '시작일이 종료일보다 뒤일 수 없습니다.';
  }

  if (isFutureYmd(from) || isFutureYmd(to)) {
    return '미래 날짜 선택 불가';
  }

  if (overOneYear(from, to)) {
    return '날짜 설정 범위 한도 초과입니다.';
  }

  return '';
};
