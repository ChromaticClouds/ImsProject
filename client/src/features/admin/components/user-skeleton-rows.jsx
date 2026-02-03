// @ts-check
import { Skeleton } from '@/components/ui/skeleton.js';
import { TableCell, TableRow } from '@/components/ui/table.js';

/**
 * @param {{ rows?: number }} props
 */
export const UserSkeletonRows = ({ rows = 10 }) => {
  return Array.from({ length: rows }).map((_, rowIdx) => (
    <TableRow key={rowIdx} className="h-16">
      <SkeletonCell width="w-0" />
      <SkeletonCell width="w-24" />
      <SkeletonCell width="w-48" />
      <SkeletonCell width="w-20" />
      <SkeletonCell width="w-24" />
      <SkeletonCell width="w-40" />
      <SkeletonCell width="w-10" />
      <SkeletonCell width="w-10" />
    </TableRow>
  ));
};

/* ---------- helpers ---------- */

const SkeletonCell = ({ width }) => (
  <TableCell>
    <Skeleton className={`h-4 ${width} rounded`} />
  </TableCell>
);
