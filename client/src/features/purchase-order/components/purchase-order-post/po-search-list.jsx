import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import { usePoSearchQuery } from '../../hooks/use-po-search-qeury.js';
import { usePoFormContext } from '../../providers/po-post-form-provder.jsx';

/**
 * @typedef {object} PoSearchListProps
 * @property {number} selectedVendorId
 * @property {boolean} open
 * @property {string} debounced
 * @property {() => void} onClick
 */

/**
 * @param {PoSearchListProps} props
 */
export const PoSearchList = ({
  selectedVendorId,
  open,
  debounced,
  onClick,
}) => {
  const { data: products = [] } = usePoSearchQuery({
    id: selectedVendorId,
    open,
    keyword: debounced,
  });

  const form = usePoFormContext();

  console.log(products);

  return products.length === 0 ? (
    <div className='h-24 flex items-center justify-center'>
      <p className='text-muted-foreground text-sm'>품목이 없습니다.</p>
    </div>
  ) : (
    <form.Field name='products'>
      {(field) => (
        <>
          {products.map((product) => (
            <button
              key={product.id}
              type='button'
              className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors'
              onClick={() => {
                field.handleChange((prev = []) => {
                  const index = prev.findIndex((p) => p.id === product.id);

                  if (index >= 0) {
                    return prev.map((item, i) =>
                      i === index
                        ? { ...item, count: (item.count ?? 0) + 1 }
                        : item,
                    );
                  }

                  return [...prev, { ...product, count: 1 }];
                });
                onClick();
              }}
            >
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
                  {product.brand} · {product.type}
                </span>
              </div>
            </button>
          ))}
        </>
      )}
    </form.Field>
  );
};
