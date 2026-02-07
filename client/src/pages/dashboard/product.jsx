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
<<<<<<< HEAD
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: ()=>fetchProducts(''),
  });


  const filter = useProductFilter(data?.content?? []);
  
  const search = useProductSearch();

  const searchedList = search.applySearch(filter.filteredList);
  const pagination = useProductPagination(searchedList);

  const [selectedProduct, setSelectedProduct] = useState(null);


  if (isLoading) return <div>상품 정보를 불러오는 중입니다...</div>;
  // 2. 에러 발생 시 처리
  if (error) return <div>에러가 발생했습니다: {error.message}</div>;



  const {
    setFilters,
    setBrandState,
    setAllBrands,
    paginatedList,
    filters,
    brandState,
    currentPage,
    setCurrentPage,
    totalPages,
  } = pagination;

=======
>>>>>>> 8846abf6542898a4f0775807a13c30984653413d
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
