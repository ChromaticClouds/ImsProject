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
 * @param {{ product: Product } & React.PropsWithChildren} param0
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

       

          {/* 낱개 이미지 */}
         {/* <div className='grid grid-cols-2 gap-4'>  가로처리로 만들거면 이거 쓸거임 */}
          <div className='flex flex-col gap-2'>
          {/* <div className='flex flex-col gap-2'>  가로처리로 만들거면 이거 쓸거임*/}
          <div className='flex flex-col gap-2'>
            <span className='text-xs text-muted-foreground'>
              낱개 이미지
            </span>
            <img
              src={product.imageUrl}
              alt='single'
              className='h-70 w-full object-contain rounded border bg-white'
            />
          </div>

          {/* 박스 이미지 */}
          <div className='flex flex-col gap-2'>
            <span className='text-xs text-muted-foreground'>
              박스 이미지
            </span>
            <img
              src={product.boxImageUrl}
              alt='box'
              className='h-50 w-full object-contain rounded border bg-white'
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
