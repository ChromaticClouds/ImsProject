import type { Dispatch, SetStateAction } from 'react';

import { Input } from '@/components/ui/input';
import { BrandDropdown } from '@/features/statistics/components/brand-dropdown.jsx';
import { TypeDropdown } from '@/features/statistics/components/type-dropdown.jsx';

import { StatisticsDateRangePicker } from './statistics-date-range-picker.jsx';

type InOutBoundFilterProps = {
  filters: {
    from: string;
    to: string;
    keyword: string;
    type: ProductType | 'ALL';
    brand: string;
  };
  actions: {
    setFrom: (from: string) => void;
    setTo: (to: string) => void;
    setKeyword: (keyword: string) => void;
    setType: Dispatch<SetStateAction<ProductType | 'ALL'>>;
    setBrand: Dispatch<SetStateAction<string>>;
  };
};

export const InOutBoundFilter = ({
  filters,
  actions,
}: InOutBoundFilterProps) => {
  const { from, to, keyword, type, brand } = filters;
  const { setFrom, setTo, setKeyword, setType, setBrand } = actions;

  return (
    <div className='flex flex-wrap items-end gap-3 mb-3'>
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-muted-foreground'>기간</label>
        <StatisticsDateRangePicker
          value={{ from, to }}
          onChange={({ from, to }) => {
            setFrom(from);
            setTo(to);
          }}
          disabled={false}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <label className='text-xs text-muted-foreground'>품목 검색</label>
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='품목명/코드'
          className='h-10 w-44'
        />
      </div>

      <div className='flex flex-col gap-1'>
        <TypeDropdown
          type={type}
          setType={setType}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <BrandDropdown
          type={type}
          brand={brand}
          setBrand={setBrand}
        />
      </div>
    </div>
  );
};
