// @ts-check
import { useSearchParams } from 'react-router-dom';
import { formatDateYMD } from './dateRange'; // 우리가 만든 헬퍼 사용

/**
 * @returns {{
 *   search: { from: string, to: string, page: number, size: number },
 *   setSearch: (next: Partial<{ from: string, to: string, page: number, size: number }>) => void
 * }}
 */
export function useInboundPendingSearch() {
  const [params, setParams] = useSearchParams();

  const today = new Date();
  const defaultFrom = formatDateYMD(today);
  const defaultTo = formatDateYMD(
    new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
  );

  const search = {
    from: params.get('from') ?? defaultFrom,
    to: params.get('to') ?? defaultTo,
    page: Number(params.get('page') ?? 0),
    size: Number(params.get('size') ?? 20),
  };

  const setSearch = (next) => {
    const merged = { ...search, ...next };

    setParams({
      from: merged.from,
      to: merged.to,
      page: String(Math.max(merged.page ?? 0, 0)),
      size: String(Math.max(merged.size ?? 20, 1)),
    });
  };

  return { search, setSearch };
}
