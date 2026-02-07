// @ts-check

import { AppDateRangePicker } from '@/components/common/app-date-range-picker.jsx';
import { CardHeader } from '@/components/ui/card.js';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.js';
import { SearchIcon } from 'lucide-react';

export const ReceiveOrderSearch = () => {
  const value = {
    from: new Date(),
    to: new Date()
  }

  return (
    <CardHeader className='border-b flex justify-between'>
      <div className='flex gap-3 items-center'>
        <span>날짜 선택</span>
        <AppDateRangePicker 
          value={value}
          onChange={() => {}}
        />
      </div>
      <div>
        <InputGroup className='w-100'>
          <InputGroupInput 
            placeholder='수주번호 / 판매처 / 대표자 / 담당자 검색'
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </CardHeader>
  );
};
