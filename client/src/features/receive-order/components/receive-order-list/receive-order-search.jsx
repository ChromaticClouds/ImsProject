// @ts-check

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';
import { ReceiveOrderListFilter } from './receive-order-list-filter.jsx';
import { SearchDateSection } from './search-date-section.jsx';
import { SearchKeywordSection } from './search-keyword-section.jsx';

const formatDate = (date) => (date ? date.toISOString().slice(0, 10) : null);

/**
 * @typedef {object} AppDateRange
 * @property {Date} from
 * @property {Date} to
 */

export const ReceiveOrderSearch = () => {
  const navigate = useNavigate();

  return (
    <CardHeader className='border-b flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between flex-wrap'>
      {/* 날짜 선택 */}
      <SearchDateSection />

      {/* 검색 + 버튼 */}
      <div className='flex flex-col gap-3 w-full md:flex-row xl:w-auto'>
        <SearchKeywordSection />

        <ReceiveOrderListFilter />

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
