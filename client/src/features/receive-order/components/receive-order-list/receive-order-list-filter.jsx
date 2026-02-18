// @ts-check

/**
 * Components
 */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';
import { useSalersQuery } from '../../hooks/use-salers-query.js';
import { Spinner } from '@/components/ui/spinner.js';
import { useReceiveOrderFilterStore } from '../../stores/use-receive-order-filter-store.js';

export const ReceiveOrderListFilter = () => {
  const { data, isLoading } = useSalersQuery();
  
  const setSaler = useReceiveOrderFilterStore((s) => s.setSaler);

  return (
    <Select
      onValueChange={(value) => {
        setSaler(value === 'all' ? undefined : Number(value));
      }}
    >
      <SelectTrigger className='w-54'>
        <SelectValue placeholder='판매처 선택' />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {isLoading && (
            <SelectItem
              value='loading'
              disabled
            >
              <Spinner />
            </SelectItem>
          )}

          <SelectItem value='all'>전체</SelectItem>

          <SelectSeparator />

          {data?.map((vendor) => (
            <SelectItem
              key={vendor.id}
              value={String(vendor.id)}
            >
              {vendor.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
