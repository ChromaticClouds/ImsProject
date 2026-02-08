// @ts-check

import { AppDateRangePicker } from '@/components/common/app-date-range-picker.jsx';
import { Button } from '@/components/ui/button.js';
import { CardHeader } from '@/components/ui/card.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';
import { SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReceiveOrderSearch = () => {
  const navigate = useNavigate();

  const value = {
    from: new Date(),
    to: new Date(),
  };

  return (
    <CardHeader className='border-b flex justify-between flex-col xl:flex-row gap-3'>
      <div className='flex gap-3 items-center w-full'>
        <span>날짜 선택</span>
        <AppDateRangePicker
          value={value}
          onChange={() => {}}
        />
      </div>
      <div className='flex gap-3'>
        <InputGroup className='w-100 xl:w-full'>
          <InputGroupInput placeholder='수주번호 / 판매처 / 대표자 / 담당자 검색' />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={() => navigate('/dashboard/receive-order/post')}>
          주문서 작성
        </Button>
      </div>
    </CardHeader>
  );
};
