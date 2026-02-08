import { useOrderPostContext } from '../providers/receive-order-post-provider.jsx';
import { OrderPostSearchSkeleton } from './order-post-search-skeleton.jsx';

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
          className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors'
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
          <img
            src={product.imageUrl || '/placeholder.png'}
            className='w-10 h-10 rounded object-cover shrink-0'
          />

          <div className='flex flex-col min-w-0'>
            {/* 제품명 */}
            <span className='text-sm font-medium truncate'>{product.name}</span>

            {/* 브랜드 · 주종 */}
            <span className='text-xs text-muted-foreground truncate'>
              {product.brand} · {product.type}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
