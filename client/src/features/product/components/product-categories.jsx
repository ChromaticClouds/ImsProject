// @ts-check

/**
 * Components
 */
import { ProductCategoryCheckbox } from './product-category-checkbox.jsx';

/**
 * Hooks
 */
import { useQuery } from '@tanstack/react-query';

/**
 * Api
 */
import { getCategories } from '../api/index.js';

export const ProductCategories = () => {
  const { data } = useQuery({
    queryKey: ['product-categories'],
    queryFn: getCategories,
    staleTime: 0,
  });

  const productType = data?.data?.types;
  const productBrand = data?.data?.brands;

  return (
    <div className='flex gap-3'>
      {/* 주종 필터 드롭다운 */}
      <ProductCategoryCheckbox
        queryKey='type'
        categories={productType}
      />

      {/* 브랜드 필터 드롭다운 */}
      <ProductCategoryCheckbox
        queryKey='brand'
        categories={productBrand}
      />
    </div>
  );

  return <></>;
};
