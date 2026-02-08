// @ts-check

/**
 * Components
 */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import { ProductDetailDialog } from './product-detail-dialog.jsx';

/**
 * Hooks
 */
import { useProductQuery } from '../hooks/use-product-query.js';

export const ProductTable = () => {
  const { content } = useProductQuery();

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/50'>
            <TableHead className='w-17.5'>이미지</TableHead>
            <TableHead className='text-center'>품목명</TableHead>
            <TableHead>품목 코드</TableHead>
            <TableHead>주종</TableHead>
            <TableHead>브랜드</TableHead>
            <TableHead className='text-right'>단가</TableHead>
            <TableHead className='text-right'>수량(박스)</TableHead>
            <TableHead className='w-12.5'></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {content.length > 0 ? (
            content.map((product) => (
              <ProductDetailDialog key={product.id} product={product}>
                <TableRow
                  key={product.id}
                  className='hover:bg-muted/20 transition-colors cursor-pointer'
                >
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='w-10 h-10 rounded'>
                        <AvatarImage
                          src={product.imageUrl}
                          alt={product.name}
                        />
                        <AvatarFallback className='w-10 h-10 rounded' />
                      </Avatar>
                    </div>
                  </TableCell>

                  <TableCell className='font-medium text-center'>
                    {product.name}
                  </TableCell>

                  <TableCell className='text-muted-foreground font-mono text-xs'>
                    {product.productCode}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant='secondary'
                      className='font-normal'
                    >
                      {product.type}
                    </Badge>
                  </TableCell>

                  <TableCell>{product.brand}</TableCell>

                  <TableCell className='text-right font-medium text-skyblue-600'>
                    {product.salePrice?.toLocaleString()}원
                  </TableCell>

                  <TableCell className='text-right font-medium'>
                    {product.perCount}개입
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
              </ProductDetailDialog>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className='h-24 text-center text-muted-foreground'
              >
                품목이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
