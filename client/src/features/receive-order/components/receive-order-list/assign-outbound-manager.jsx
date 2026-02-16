import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select.js';
import { useOutboundManagersContext } from '../../providers/receive-order-table-provider.jsx';

/**
 * @param {{
 *  manager: { managerName: string | null, managerId: number | null },
 *  onChange: (managerId: number | null) => void
 * }} props
 */
export const AssignOutboundManager = ({ manager, onChange }) => {
  const { managers } = useOutboundManagersContext();

  const value =
    manager?.managerId != null ? manager.managerId.toString() : 'UNASSIGNED';

  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        const nextManagerId =
          nextValue === 'UNASSIGNED' ? null : Number(nextValue);
        onChange(nextManagerId);
      }}
    >
      <SelectTrigger className='w-36'>
        <SelectValue placeholder='선택해주세요' />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value='UNASSIGNED'>미지정</SelectItem>
          {managers.map((m) => (
            <SelectItem
              key={m.id}
              value={m.id.toString()}
            >
              {m.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
