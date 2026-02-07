// @ts-check

import { AppDatePicker } from '@/components/common/app-date-picker.jsx';
import { Input } from '@/components/ui/input.js';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';

export const OrderPostHeader = () => {
  return (
    <section className='flex flex-col gap-4'>
      {/* row 1 */}
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
          <span className='text-sm md:text-base'>수주 번호</span>
          <Input
            className='w-full md:w-60'
            value='A012'
            disabled
          />
        </div>

        <div className='grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
          <span className='text-sm md:text-base'>수주 날짜</span>
          <Input
            className='w-full md:w-60'
            value={new Date().toLocaleDateString()}
            disabled
          />
        </div>
      </div>

      {/* row 2 */}
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
          <span className='text-sm md:text-base'>담당자</span>
          <Select>
            <SelectTrigger className='w-full md:w-60'>
              <SelectValue placeholder='담당자를 선택하세요.' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='HR'>강동우</SelectItem>
                <SelectItem value='CS'>김민수</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
          <span className='text-sm md:text-base'>판매처</span>
          <Select>
            <SelectTrigger className='w-full md:w-60'>
              <SelectValue placeholder='판매처를 선택하세요.' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='NAVER'>네이버 스마트스토어</SelectItem>
                <SelectItem value='COUPANG'>쿠팡</SelectItem>
                <SelectItem value='OFFLINE'>오프라인</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* row 3 */}
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div className='grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
          <span className='text-sm md:text-base'>납기 희망일</span>
          <AppDatePicker
            date={new Date()}
            setDate={() => {}}
          />
        </div>
      </div>
    </section>
  );
};
