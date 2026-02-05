// @ts-check

import { Filter, MoreHorizontal, Package2 } from 'lucide-react';

import { useEffect, useState } from 'react';

/** shadcn/ui 컴포넌트 */
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import { ProductPagination } from '@/features/product/components/product-pagination';
import { useProductPagination } from '@/features/product/hooks/use-product-pagination';
import { useProductSearch } from '@/features/product/hooks/use-product-serch';
import { useProductFilter } from '@/features/product/hooks/use-product-filter';
import { Input } from '@/components/ui/input';
import { ProductDetailDialog } from '@/features/product/components/product-dialog';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/features/product/api/product';
import { ProductTable } from '@/features/product/components/product-table';


export const Product = () => {
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const filter = useProductFilter(data ?? []);
  
  const search = useProductSearch();

  const searchedList = search.applySearch(filter.filteredList);
  const pagination = useProductPagination(searchedList);

  const [selectedProduct, setSelectedProduct] = useState(null);

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

  return (
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-2'
                >
                  <Filter className='w-4 h-4' /> 주종 필터링
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-48'
              >
                <DropdownMenuLabel>카테고리 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(filter.filters).map((cat) => (
                  <DropdownMenuCheckboxItem
                    key={cat}
                    checked={filter.filters[cat]}
                    onCheckedChange={(checked) =>
                      filter.setFilters((prev) => ({ ...prev, [cat]: checked }))
                    }
                  >
                    {cat}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 브랜드 필터 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-2'
                >
                  <Filter className='brand' /> 브랜드 필터링
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-48'
              >
                {/* 드롭다운시 전체 선택, 해제 버튼 */}
                <DropdownMenuLabel className='flex justify-between items-center'>
                  브랜드 선택
                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={(e) => {
                        e.preventDefault();
                        setAllBrands(true);
                      }}
                    >
                      전체
                      <br />
                      선택
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={(e) => {
                        e.preventDefault();
                        setAllBrands(false);
                      }}
                    >
                      선택
                      <br />
                      해제
                    </Button>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(filter.brandState).map((brand) => (
                  <DropdownMenuCheckboxItem
                    key={brand}
                    onSelect={(e) => e.preventDefault()}
                    checked={filter.brandState[brand]}
                    onCheckedChange={(checked) =>
                      setBrandState((prev) => ({ ...prev, [brand]: checked }))
                    }
                  >
                    {brand}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className='flex flex-col gap-4'>
          {/* 🔍 검색 영역 */}
          <div className='flex items-center gap-2'>
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
          </div>

          {/* 품목 테이블 */}
          <ProductTable paginatedList={paginatedList} />

          <CardFooter>
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </CardFooter>
        </CardContent>
      </Card>

      <ProductDetailDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
