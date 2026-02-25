import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import { useOrderPostContext } from '../../providers/receive-order-post-provider.jsx';
import { OrderPostSearchSkeleton } from './order-post-search-skeleton.jsx';
import { typeMap } from '@/constants/product-type.js';

/**
 * @param {{ products: OrderPostProduct[], isFetching: boolean, onClick: () => void }} props
 */
export const OrderPostSearchList = ({ products, isFetching, onClick }) => {
  const { form } = useOrderPostContext();

  if (isFetching) {
    return <OrderPostSearchSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className='px-4 py-6 text-sm text-center text-muted-foreground'>
        검색 결과가 없습니다
      </div>
    );
  }

  return (
    <div className='max-h-80 overflow-y-auto'>
      {products.map((product) => (
        <button
          key={product.id}
          type='button'
          className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors justify-between'
          onClick={() => {
            form.setFieldValue('products', (prev) => {
              const existsIndex = prev.findIndex((p) => p.id === product.id);

              if (existsIndex !== -1) {
                return prev.map((p, i) =>
                  i === existsIndex ? { ...p, amount: p.amount + 1 } : p,
                );
              }

              return [...prev, { ...product, amount: 1 }];
            });

            onClick();
          }}
        >
          <div className='flex gap-3 items-center'>
            <Avatar className='w-10 h-10 rounded'>
              <AvatarImage
                src={product.imageUrl}
                alt={product.name}
                className='w-10 h-10 rounded object-cover shrink-0'
              />
              <AvatarFallback className='w-10 h-10 rounded' />
            </Avatar>

            <div className='flex flex-col min-w-0'>
              {/* 제품명 */}
              <span className='text-sm font-medium truncate'>
                {product.name}
              </span>

              {/* 브랜드 · 주종 */}
              <span className='text-xs text-muted-foreground truncate'>
                {product.brand} · {typeMap[product.type]}
              </span>
            </div>
          </div>
          <div className="text-sm">
            {product.stockCount}
          </div>
        </button>
      ))}
    </div>
  );
};
