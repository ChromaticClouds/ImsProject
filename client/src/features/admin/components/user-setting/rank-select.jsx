// @ts-check

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const RANK_OPTIONS = [
  { value: 'FIRST_ADMIN', label: '총괄 책임자' },
  { value: 'SECOND_ADMIN', label: '창고 관리자' },
  { value: 'EMPLOYEE', label: '사원' },
];

/**
 * @param {string} v - The rank value to get the label for.
 * @returns {string} The label corresponding to the rank value.
 */
const getLabel = (v) =>
  RANK_OPTIONS.find((o) => o.value === v)?.label ?? '';

/**
 * @param {{
 *  value: 'FIRST_ADMIN' | 'SECOND_ADMIN' | 'EMPLOYEE',
 *  disabled: boolean
 *  onChange?: (rank: string) => void
 * }} props
 */
export const RankSelect = ({ value, disabled, onChange }) => {
  const selectableOptions = RANK_OPTIONS.filter(
    (opt) => opt.value !== 'FIRST_ADMIN',
  );

  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(v) => onChange?.(v)}
    >
      <SelectTrigger className='h-9 w-full'>
        <SelectValue>
          <span>{getLabel(value)}</span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {selectableOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};