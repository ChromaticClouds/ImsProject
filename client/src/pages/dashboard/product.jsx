// @ts-check

/**
 * Components
 */
import { Card, CardContent } from '@/components/ui/card';
import { ProductPagination } from '@/features/product/components/product-pagination';
import { ProductTable } from '@/features/product/components/product-table';
import { ProductProvider } from '@/features/product/providers/product-provider.jsx';
import { ProductSearch } from '@/features/product/components/product-search.jsx';
import { ProductHeader } from '@/features/product/components/product-header.jsx';

export const Product = () => {
  return (
    <ProductProvider>
      <div className='p-6 max-w-6xl mx-auto space-y-6'>
        <Card>
          <ProductHeader />
          <CardContent className='w-full flex flex-col gap-4'>
            <ProductSearch />
            <ProductTable />
            <ProductPagination />
          </CardContent>
        </Card>
      </div>
    </ProductProvider>
  );
};
