// @ts-check

import { Filter, MoreHorizontal, Package2 } from 'lucide-react';

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

export const Product = () => {
  const pagination = useProductPagination();

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
                {Object.keys(filters).map((cat) => (
                  <DropdownMenuCheckboxItem
                    key={cat}
                    checked={filters[cat]}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({ ...prev, [cat]: checked }))
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
                      <br /> 해제
                    </Button>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(brandState).map((brand) => (
                  <DropdownMenuCheckboxItem
                    key={brand}
                    onSelect={(e) => e.preventDefault()}
                    checked={brandState[brand]}
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

        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50'>
                  <TableHead className='w-[70px]'>이미지</TableHead>
                  <TableHead>품목명</TableHead>
                  <TableHead>품목 코드</TableHead>
                  <TableHead>주종</TableHead>
                  <TableHead>브랜드</TableHead>
                  <TableHead className='text-right'>단가</TableHead>
                  <TableHead className='text-right'>수량(박스)</TableHead>
                  <TableHead className='w-[50px]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedList.length > 0 ? (
                  paginatedList.map((product) => (
                    <TableRow
                      key={product.id}
                      className='hover:bg-muted/20 transition-colors'
                    >
                      <TableCell>
                        <img
                          src={product.image}
                          alt=''
                          className='w-10 h-10 rounded border bg-white object-cover'
                        />
                      </TableCell>

                      <TableCell className='font-medium'>
                        {product.name}
                      </TableCell>
                      <TableCell className='text-muted-foreground font-mono text-xs'>
                        {product.code}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant='secondary'
                          className='font-normal'
                        >
                          {product.category}
                        </Badge>
                      </TableCell>

                      <TableCell>{product.brand}</TableCell>

                      <TableCell className='text-right font-medium text-skyblue-600'>
                        {product.sale_price?.toLocaleString()}원
                      </TableCell>

                      <TableCell className='text-right font-medium'>
                        {product.boxQuantity}개입
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='h-24 text-center text-muted-foreground'
                    >
                      선택된 카테고리의 품목이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <CardFooter>
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};
