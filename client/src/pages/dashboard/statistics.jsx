// @ts-check

import * as React from 'react';

/**
 * Components
 */
import { InOutBound } from '@/features/statistics/components/in-out-bound.jsx';
import { AppHeader } from '@/components/common/app-header.jsx';
import { StockShare } from '@/features/statistics/components/stock-share.jsx';
import { ClientRank } from '@/features/statistics/components/client-rank.jsx';
import { StockRotation } from '@/features/statistics/components/stock-rotation.jsx';
import { LeadTime } from '@/features/statistics/components/lead-time.jsx';

export const Statistics = () => {
  return (
    <React.Fragment>
      <AppHeader
        title='통계 및 리포트'
        description='현황 및 내역을 통계로 확인하세요.'
      />
      <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-10 gap-4'>
          <InOutBound />
          <StockShare />
        </div>
        <div className='grid grid-cols-10 gap-4'>
          <ClientRank />
          <StockRotation />
        </div>
        <LeadTime />
      </div>
    </React.Fragment>
  );
};
