import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const toMoney = (value) => Number(value || 0).toLocaleString();

export function VendorItemsSection({ isSupplier, itemsState }) {
  const {
    itemKeyword,
    setItemKeyword,
    selectedItems,
    filteredItems,
    itemsLoading,
    showSearchDropdown,
    isValidItemsForSupplier,
    onSelectItem,
    onChangeUnitPrice,
    onRemoveItem,
  } = itemsState;

  return (
    <div className='rounded-2xl border bg-secondary p-4'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='font-semibold'>품목 설정</div>
        <Badge variant='secondary'>{isSupplier ? '필수' : '미사용'}</Badge>
      </div>

      {!isSupplier ? (
        <div className='rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground'>
          판매처는 품목과 구매 단가를 설정하지 않습니다.
        </div>
      ) : (
        <>
          <div className='text-xs text-muted-foreground'>
            품목을 검색해서 추가하고 각 품목의 구매 단가를 입력하세요.
          </div>

          <div className='relative mt-3'>
            <Input
              value={itemKeyword}
              onChange={(e) => setItemKeyword(e.target.value)}
              placeholder='품목 검색'
            />

            {showSearchDropdown ? (
              <ItemSearchDropdown
                itemsLoading={itemsLoading}
                filteredItems={filteredItems}
                onSelectItem={onSelectItem}
              />
            ) : null}
          </div>

          <SelectedItemsPanel
            selectedItems={selectedItems}
            onChangeUnitPrice={onChangeUnitPrice}
            onRemoveItem={onRemoveItem}
          />

          {!isValidItemsForSupplier ? (
            <div className='mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive'>
              공급처는 품목 1개 이상과 모든 품목의 단가가 필요합니다.
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function ItemSearchDropdown({ itemsLoading, filteredItems, onSelectItem }) {
  return (
    <div className='absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border bg-secondary shadow-xl'>
      {itemsLoading ? (
        <div className='px-3 py-3 text-sm text-muted-foreground'>검색 중...</div>
      ) : filteredItems.length === 0 ? (
        <div className='px-3 py-3 text-sm text-muted-foreground'>
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className='max-h-[260px] overflow-auto'>
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type='button'
              onClick={() => onSelectItem(item)}
              className='flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted/40'
            >
              <span className='truncate'>{item.name}</span>
              <span className='text-xs text-muted-foreground'>추가</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SelectedItemsPanel({ selectedItems, onChangeUnitPrice, onRemoveItem }) {
  return (
    <div className='mt-4'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='text-sm font-semibold'>선택한 품목</div>
        <div className='text-xs text-muted-foreground'>
          {selectedItems.length}개
        </div>
      </div>

      {selectedItems.length === 0 ? (
        <div className='rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground'>
          품목을 추가해 주세요. 공급처는 최소 1개가 필요합니다.
        </div>
      ) : (
        <div className='space-y-2'>
          {selectedItems.map((item) => {
            const invalid = !item.unitPrice || item.unitPrice <= 0;

            return (
              <div
                key={item.itemId}
                className='rounded-xl border p-3'
              >
                <div className='flex items-start justify-between gap-2'>
                  <div className='min-w-0'>
                    <div className='truncate text-sm font-semibold'>
                      {item.itemName}
                    </div>
                    <div className='mt-1 text-xs text-muted-foreground'>
                      구매 단가를 입력하세요.
                    </div>
                  </div>

                  <button
                    type='button'
                    onClick={() => onRemoveItem(item.itemId)}
                    className='rounded-md border px-2 py-1 text-xs font-semibold hover:bg-muted/40'
                  >
                    삭제
                  </button>
                </div>

                <div className='mt-3 flex items-center gap-2'>
                  <Input
                    value={String(item.unitPrice ?? 0)}
                    onChange={onChangeUnitPrice(item.itemId)}
                    placeholder='단가'
                    inputMode='numeric'
                    className={`text-right tabular-nums ${
                      invalid ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                  />
                  <div className='shrink-0 text-sm font-semibold text-muted-foreground'>
                    원
                  </div>
                </div>

                {invalid ? (
                  <div className='mt-1 text-xs text-destructive'>
                    단가는 1원 이상이어야 합니다.
                  </div>
                ) : (
                  <div className='mt-1 text-xs text-muted-foreground'>
                    입력 단가:{' '}
                    <span className='font-semibold'>
                      {toMoney(item.unitPrice)}원
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
