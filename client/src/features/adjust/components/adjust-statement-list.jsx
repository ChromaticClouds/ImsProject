import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import { useAdjustContext } from '../providers/adjust-provider.jsx';
import { typeMap } from '@/constants/product-type.js';

const FALLBACK_IMAGE = 'https://placehold.co/64x64?text=No+Image';

export const AdjustStatementList = () => {
  const { form } = useAdjustContext();

  return (
    <form.Subscribe selector={(s) => [s.values.products, s.values.type]}>
      {(/** @type {[AdjustItem[], 'PLUS' | 'MINUS']} */ [products, type]) => {
        if (!products.length) {
          return (
            <div className='flex flex-col items-center justify-center gap-2 py-14 text-center'>
              <div className='text-sm text-muted-foreground'>
                선택된 조정 품목이 없습니다.
              </div>
              <div className='text-xs text-muted-foreground/70'>
                좌측 목록에서 품목을 추가해 주세요.
              </div>
            </div>
          );
        }

        const totalItems = products.length;
        const totalAdjustCount = products.reduce(
          (sum, item) => sum + (item.adjustCount ?? 0),
          0,
        );

        const isPlus = type === 'PLUS';

        return (
          <div className='rounded-2xl border bg-background shadow-sm overflow-hidden'>
            {/* Header / Summary */}
            <div className='sticky top-0 z-10 border-b bg-background/80 backdrop-blur'>
              <div className='flex items-center justify-between px-4 py-3'>
                <div className='flex items-center gap-2 min-w-0'>
                  <span
                    className={[
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                      isPlus
                        ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20'
                        : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
                    ].join(' ')}
                  >
                    {isPlus ? '증가 조정' : '감소 조정'}
                  </span>

                  <div className='text-sm text-muted-foreground truncate'>
                    총{' '}
                    <span className='font-semibold text-foreground'>
                      {totalItems}
                    </span>
                    개 품목
                  </div>
                </div>

                <div
                  className={[
                    'text-sm font-semibold tabular-nums',
                    isPlus ? 'text-green-400' : 'text-red-400',
                  ].join(' ')}
                >
                  {isPlus ? '총 입고 +' : '총 출고 -'}
                  {totalAdjustCount}
                </div>
              </div>
            </div>

            {/* List */}
            <div className='max-h-105 overflow-y-auto p-3'>
              <div className='space-y-2'>
                {products.map((item) => {
                  const nextStock =
                    (item.currentStock ?? 0) +
                    (isPlus ? 1 : -1) * (item.adjustCount ?? 0);

                  return (
                    <div
                      key={item.id}
                      className='rounded-xl border bg-card p-3 shadow-sm transition hover:bg-accent/40'
                    >
                      <div className='grid grid-cols-[64px_1fr_auto] gap-3 items-center'>
                        {/* Image */}
                        <Avatar className='h-16 w-16 rounded-xl bg-muted'>
                          <AvatarImage
                            src={item.imageUrl || FALLBACK_IMAGE}
                            alt={item.name}
                            onError={(e) => {
                              // @ts-ignore
                              e.currentTarget.src = FALLBACK_IMAGE;
                            }}
                          />
                          <AvatarFallback className='rounded-xl'>
                            {item?.name?.slice(0, 2) ?? 'NA'}
                          </AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className='min-w-0'>
                          <div className='flex items-center gap-2 min-w-0'>
                            <div className='min-w-0 flex-1'>
                              <div className='font-medium truncate'>
                                {item.name}
                              </div>
                            </div>
                          </div>

                          <div className='mt-1 text-sm text-muted-foreground truncate flex gap-2'>
                            {item.brand}
                            <span className='shrink-0 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground'>
                              {typeMap[item.type]}
                            </span>
                          </div>

                          <div className='mt-2 flex items-center gap-2 text-xs text-muted-foreground'>
                            <span className='tabular-nums'>
                              현재 재고{' '}
                              <span className='text-foreground/90'>
                                {item.currentStock}
                              </span>
                            </span>
                            <span className='text-muted-foreground/50'>→</span>
                            <span className='tabular-nums'>
                              예정{' '}
                              <span className='text-foreground/90'>
                                {nextStock}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Adjust */}
                        <div className='text-right'>
                          <div
                            className={[
                              'inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold tabular-nums',
                              isPlus
                                ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20'
                                : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
                            ].join(' ')}
                            title='조정 수량'
                          >
                            {isPlus ? '+' : '-'}
                            {item.adjustCount}
                          </div>

                          <div className='mt-2 text-xs text-muted-foreground tabular-nums'>
                            변경 후{' '}
                            <span className='text-foreground/90'>
                              {nextStock}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer hint (optional) */}
            <div className='border-t bg-background px-4 py-3 text-xs text-muted-foreground'>
              스크롤하여 전체 품목을 확인할 수 있어요.
            </div>
          </div>
        );
      }}
    </form.Subscribe>
  );
};
