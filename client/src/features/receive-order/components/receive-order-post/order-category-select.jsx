// @ts-check

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';
import { useOrderPostContext } from '../../providers/receive-order-post-provider.jsx';

/**
 * @typedef {object} OrderCategoryProps
 * @property {'users' | 'sellers'} categoryKey
 * @property {string} label
 * @property {string} [placeholder]
 */

/**
 * @typedef {object} FormNameMap
 * @property {'userId'} users
 * @property {'sellerId'} sellers
 */

/**
 * @type {FormNameMap}
 */
const FORM_NAME_MAP = {
  users: 'userId',
  sellers: 'sellerId',
};

/**
 * 카테고리 키에 따라서 셀렉트 박스의 항목 렌더링 분기
 * @param {OrderCategoryProps} props
 */
export const OrderCategorySelect = ({ categoryKey, label, placeholder }) => {
  const { form, categories } = useOrderPostContext();

  const category = categories?.[categoryKey] ?? [];
  const formName = FORM_NAME_MAP[categoryKey];

  return (
    <div className='grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
      <span className='text-sm md:text-base'>{label}</span>
      <form.Field name={formName}>
        {(field) => (
          <Select
            value={field.state.value ? String(field.state.value) : ''}
            onValueChange={(v) => 
              field.handleChange(v ? Number(v) : undefined)
            }
          >
            <SelectTrigger className='w-full md:w-60'>
              <SelectValue placeholder={placeholder ?? ''} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {category.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={String(item.id)}
                  >
                    {item.name ?? '(해당 없음)'}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </form.Field>
    </div>
  );
};
