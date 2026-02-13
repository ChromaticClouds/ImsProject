import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Badge } from '@/components/ui/badge';

const DetailRow = ({ label, value }) => (
  <>
    <span className='text-muted-foreground'>{label}</span>
    <span className='font-medium'>{value}</span>
  </>
);

/**
 * @param {{ product: Product} & React.PropsWithChildren} param0
 */
export const ProductDetailDialog = ({ product, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='w-sm'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>
            <span>{product.name}</span>
            <Badge variant='secondary'>{product.type}</Badge>
          </DialogTitle>
          <DialogDescription className='font-mono text-xs'>
            품목 코드 - {product.productCode}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-2'>
          <span className='text-xs text-muted-foreground'>박스 이미지</span>
          <div className='w-full h-100 rounded overflow-hidden'>
            <img
              src={product.imageUrl}
              alt='box'
              className='w-full h-full object-cover'
            />
          </div>
        </div>

        {/* 상세 정보 */}
        <div className='mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm'>
          <DetailRow
            label='브랜드'
            value={product.brand}
          />
          <DetailRow
            label='박스당 낱개 수'
            value={`${product.perCount}개입`}
          />
          <DetailRow
            label='단가'
            value={`${product.salePrice}원`}
          />
          <DetailRow
            label='등록일'
            value={product.createdAt}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
