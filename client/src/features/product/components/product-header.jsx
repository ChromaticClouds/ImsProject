/**
 * Components
 */
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { ProductCategories } from './product-categories.jsx';

/**
 * Assets
 */
import { Package2Icon } from 'lucide-react';

export const ProductHeader = () => {
  return (
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7'>
      <div>
        <CardTitle className='text-xl font-bold flex items-center gap-2'>
          <Package2Icon className='w-5 h-5 text-primary' />
          <span>품목 목록</span>
        </CardTitle>
        <CardDescription>
          등록된 전체 주류 품목을 확인하고 주종별로 필터링할 수 있습니다.
        </CardDescription>
      </div>

      {/* 카테고리 필터 */}
      <ProductCategories />
    </CardHeader>
  );
};
