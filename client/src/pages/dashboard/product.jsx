// @ts-check

/**
 * Components
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ProductTable } from '@/features/product/components/product-table';

/**
 * Assets
 */
import { Package2 } from 'lucide-react';
import { ProductTypeCheckBox } from '@/features/product/components/product-type-checkbox.jsx';
import { ProductBrandCheckbox } from '@/features/product/components/product-brand-checkbox.jsx';
import { ProductProvider } from '@/features/product/providers/product-provider.jsx';

export const Product = () => {
  return (
    <ProductProvider>
      <div className='p-6 max-w-6xl mx-auto space-y-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7'>
            <div>
              <CardTitle className='text-xl font-bold flex items-center gap-2'>
                <Package2 className='w-5 h-5 text-primary' />
                품목 목록
              </CardTitle>
              <CardDescription>
                등록된 전체 주류 품목을 확인하고 주종별로 필터링할 수 있습니다.
              </CardDescription>
            </div>

            <div className='flex gap-3'>
              {/* 주종 필터 드롭다운 */}
              <ProductTypeCheckBox />

              {/* 브랜드 필터 드롭다운 */}
              <ProductBrandCheckbox />
            </div>
          </CardHeader>

          <CardContent className='flex flex-col gap-4'>
            {/* 🔍 검색 영역 */}
            {/* <div className='flex items-center gap-2'>
            <Input
              type='text'
              placeholder='품목명 / 브랜드 / 코드 검색'
              value={search.keyword}
              onChange={(e) => {
                search.setKeyword(e.target.value);
                pagination.setCurrentPage(1); // ⭐ 검색 시 페이지 초기화
              }}
              className='h-9 w-64 rounded-md border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary'
            />
          </div> */}

            {/* 품목 테이블 */}
            <ProductTable />

            <CardFooter>
              {/* <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            /> */}
            </CardFooter>
          </CardContent>
        </Card>

        {/* <ProductDetailDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      /> */}
      </div>
    </ProductProvider>
  );
};
