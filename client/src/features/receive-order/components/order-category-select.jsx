// @ts-check

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';
import { useReceiveOrderContext } from '@/features/receive-order/providers/receive-order-provider.jsx';

/**
 * @typedef {object} OrderCategoryProps
 * @property {'users' | 'sellers'} categoryKey
 * @property {string} label
 * @property {string} [placeholder]
 */

/**
 * @param {OrderCategoryProps} props 
 */
export const OrderCategorySelect = ({ categoryKey, label, placeholder }) => {
  const context = useReceiveOrderContext();

  const category = context[categoryKey] ?? [];

  return (
    <div className='grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
      <span className='text-sm md:text-base'>{label}</span>
      <Select>
        <SelectTrigger className='w-full md:w-60'>
          <SelectValue placeholder={placeholder ?? ''} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {category.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
