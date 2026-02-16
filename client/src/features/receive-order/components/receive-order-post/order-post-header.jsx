// @ts-check

import { OrderCategorySelect } from './order-category-select.jsx';
import { ReceiveOrderDatePicker } from './order-post-date-picker.jsx';
import { OrderBootstrap } from './order-bootstrap.jsx';

export const OrderPostHeader = () => {

  return (
    <section className='flex flex-col gap-4'>
      {/* row 1 */}
      <OrderBootstrap />

      {/* row 2 */}
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <OrderCategorySelect
          label='출고 담당자'
          placeholder='담당자를 선택해주세요'
          categoryKey='users'
        />

        <OrderCategorySelect
          label='판매처'
          placeholder='판매처를 선택해주세요'
          categoryKey='sellers'
        />
      </div>

      {/* row 3 */}
      <ReceiveOrderDatePicker />
    </section>
  );
};
