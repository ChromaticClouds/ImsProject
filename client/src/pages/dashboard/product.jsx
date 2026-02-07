// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ProductPagination } from '@/features/product/components/product-pagination';
import { Input } from '@/components/ui/input';
import { ProductDetailDialog } from '@/features/product/components/product-detail-dialog';
import { ProductTable } from '@/features/product/components/product-table';

/**
 * Assets
 */
import { Package2 } from 'lucide-react';
import { ProductProvider } from '@/features/product/providers/product-provider.jsx';
import { ProductCategories } from '@/features/product/components/product-categories.jsx';
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
