/**
 * Components
 */
import { AppDateRangePicker } from '@/components/common/app-date-range-picker.jsx';
import { Button } from '@/components/ui/button.js';
import { CardHeader } from '@/components/ui/card.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';

/**
 * Assets
 */
import { SearchIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useDebounce } from '@/hooks/use-debounce.js';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const formatDate = (date) => (date ? date.toISOString().slice(0, 10) : null);

export const ReceiveOrderSearch = ({ onSearch }) => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  const [keyword, setKeyword] = useState('');
  const debounced = useDebounce(keyword, 500);

  useEffect(() => {
    onSearch({
      search: debounced || null,
      fromDate: formatDate(dateRange.from),
      toDate: formatDate(dateRange.to),
    });
  }, [debounced, dateRange]);

  return (
    <CardHeader className='border-b flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between'>
      {/* 날짜 선택 */}
      <div className='flex items-center gap-3 w-full xl:w-auto'>
        <span className='shrink-0'>날짜 선택</span>
        <AppDateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
      </div>

      {/* 검색 + 버튼 */}
      <div className='flex flex-col gap-3 w-full md:flex-row xl:w-auto'>
        <InputGroup className='w-full md:min-w-[320px] xl:w-100'>
          <InputGroupInput
            placeholder='수주번호 / 판매처 / 대표자 / 담당자 검색'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon className='h-4 w-4' />
          </InputGroupAddon>
        </InputGroup>

        <Button
          className='w-full md:w-auto'
          onClick={() => navigate('/dashboard/receive-order/post')}
        >
          주문서 작성
        </Button>
      </div>
    </CardHeader>
  );
};
