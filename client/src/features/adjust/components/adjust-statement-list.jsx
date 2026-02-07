import { useAdjustContext } from '../providers/adjust-provider.jsx';

const FALLBACK_IMAGE = 'https://placehold.co/64x64?text=No+Image';

export const AdjustStatementList = () => {
  const { form } = useAdjustContext();

  return (
    <form.Subscribe selector={(s) => [s.values.products, s.values.type]}>
      {(/** @type {[AdjustItem[], 'PLUS' | 'MINUS']} */ [products, type]) => {
        if (!products.length) {
          return (
            <div className='text-sm text-muted-foreground text-center py-12'>
              선택된 조정 품목이 없습니다.
            </div>
          );
        }

        const totalItems = products.length;
        const totalAdjustCount = products.reduce(
          (sum, item) => sum + item.adjustCount,
          0,
        );

        return (
          <div className='border rounded-lg bg-accent overflow-hidden'>
            {/* 요약 영역 */}
            <div className='flex justify-between items-center px-4 py-3 border-b bg-background sticky top-0 z-10'>
              <div className='text-sm'>
                총 <span className='font-semibold'>{totalItems}</span>개 품목
              </div>

              <div
                className={`text-sm font-semibold ${
                  type === 'PLUS' ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {type === 'PLUS' ? '총 입고' : '총 출고'}{' '}
                {type === 'PLUS' ? '+' : '-'}
                {totalAdjustCount}
              </div>
            </div>

            {/* 리스트 */}
            <div className='max-h-[420px] overflow-y-auto'>
              {products.map((item) => (
                <div
                  key={item.id}
                  className='p-4 border-b last:border-b-0'
                >
                  <div className='grid grid-cols-[64px_1fr_auto] gap-4 items-center'>
                    {/* 이미지 */}
                    <img
                      src={item.imageUrl || FALLBACK_IMAGE}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className='w-16 h-16 rounded object-cover bg-muted'
                    />

                    {/* 상품 정보 */}
                    <div className='min-w-0'>
                      <div className='font-medium truncate'>
                        {item.name}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {item.brand} · {item.type}
                      </div>
                      <div className='text-xs text-muted-foreground mt-1'>
                        현재 재고: {item.currentStock}
                      </div>
                    </div>

                    {/* 조정 수량 */}
                    <div className='text-right'>
                      <div
                        className={`text-lg font-semibold ${
                          type === 'PLUS'
                            ? 'text-green-300'
                            : 'text-red-300'
                        }`}
                      >
                        {type === 'PLUS' ? '+' : '-'}
                        {item.adjustCount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </form.Subscribe>
  );
};
