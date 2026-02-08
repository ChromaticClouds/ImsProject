// @ts-check

import { AppHeader } from '@/components/common/app-header.jsx';
import { OrderPostHeader } from '@/features/receive-order/components/order-post-header.jsx';
import React from 'react';

/**
 *
 * @param {*} param0
 * @returns
 */
export const ReceiveOrderPostContainer = ({ children }) => {
  return (
    <React.Fragment>
      <AppHeader
        title='발주서 작성'
        description='발주서 작성 페이지입니다'
      />
      <div className='flex flex-col gap-6'>{children}</div>
    </React.Fragment>
  );
};
