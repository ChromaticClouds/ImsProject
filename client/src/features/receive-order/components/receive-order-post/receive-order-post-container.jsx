// @ts-check

import { AppHeader } from '@/components/common/app-header.jsx';
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
        title='주문서 작성'
        description='주문서 작성 페이지입니다'
      />
      <div className='flex flex-col gap-6'>{children}</div>
    </React.Fragment>
  );
};
