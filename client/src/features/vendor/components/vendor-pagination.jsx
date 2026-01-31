// @ts-check

import { Button } from '@/components/ui/button';

/**
 * 페이지네이션 정보 객체
 *
 * @typedef {object} PageInfo
 * @property {number} page         - 현재 페이지 (API 기준, 1-base)
 * @property {number} totalPages  - 전체 페이지 수
 */

/**
 * VendorPagination 컴포넌트 props
 *
 * @typedef {object} VendorPaginationProps
 * @property {PageInfo} pageInfo
 *   - 서버에서 내려온 페이지 정보
 * @property {(page: number) => void} onChange
 *   - 페이지 변경 시 호출되는 콜백
 *   - 전달되는 page 값은 API 기준 (1-base)
 */

/**
 * 거래처 목록 페이지네이션 컴포넌트
 *
 * 📌 역할
 * - 이전 / 다음 버튼을 통해 페이지 이동
 * - 현재 페이지와 전체 페이지 수를 표시
 *
 * 📌 전제
 * - page 값은 항상 1-base
 * - 페이지 변경 시 onChange 콜백을 통해
 *   상위 컴포넌트가 URL / 상태를 갱신한다
 *
 * @param {VendorPaginationProps} props
 */
export const VendorPagination = ({ pageInfo, onChange }) => {
  const { page, totalPages } = pageInfo;

  return (
    <div className='flex justify-center gap-2'>
      <Button
        variant='outline'
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        이전
      </Button>

      <span className='px-4 py-2'>
        {page} / {totalPages}
      </span>

      <Button
        variant='outline'
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        다음
      </Button>
    </div>
  );
};
