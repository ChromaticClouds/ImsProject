// @ts-check
import { Skeleton } from '@/components/ui/skeleton.js';
import { TableCell, TableRow } from '@/components/ui/table.js';

/**
 * @param {{ rows?: number }} props
 */
export const UserSkeletonRows = ({ rows = 10 }) => {
  return Array.from({ length: rows }).map((_, rowIdx) => (
    <TableRow
      key={rowIdx}
      className='h-16'
    >
      <SkeletonCell />
      <SkeletonCell />
      <SkeletonCell />
      <SkeletonCell />
      <SkeletonCell />
      <SkeletonCell />
      <SkeletonCell />
      <SkeletonCell />
    </TableRow>
  ));
};

/* ---------- helpers ---------- */

const SkeletonCell = () => (
  <TableCell>
    <Skeleton className='h-4 rounded' />
  </TableCell>
);
