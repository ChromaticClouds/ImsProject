// @ts-check
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_SELECTED_ITEMS_SUPPLIER } from '@/features/vendor/mock/index.js';

/**
 * @param {{
 *   vendorType: 'Supplier' | 'Seller'
 *   itemKeyword: string
 *   setItemKeyword: (v: string) => void
 *   itemsLoading: boolean
 *   filteredItems: { id: number, name: string }[]
 *   selectedItems: { itemId: number, itemName: string, unitPrice: number }[]
 *   onSelectItem: (item: { id: number, name: string }) => void
 *   onChangeUnitPrice: (itemId: number) => (e: React.ChangeEvent<HTMLInputElement>) => void
 *   onRemoveItem: (itemId: number) => void
 * }} props
 */
export function SupplierItemsSection({
  vendorType,
  itemKeyword,
  setItemKeyword,
  itemsLoading,
  filteredItems,
  selectedItems,
  onSelectItem,
  onChangeUnitPrice,
  onRemoveItem,
}) {
  const showDropdown = itemKeyword.trim().length > 0;

  return (
    <Card className='border-dashed'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base flex items-center gap-2'>
          {vendorType === 'Supplier' ? '공급처 품목' : '판매처 품목'}
          <Badge
            variant='secondary'
            className='font-normal'
          >
            {selectedItems.length}개 선택됨
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* 검색 */}
        <div className='space-y-2'>
          <div className='text-sm font-medium'>품목 검색</div>

          <div className='relative'>
            <Input
              value={itemKeyword}
              onChange={(e) => setItemKeyword(e.target.value)}
              placeholder='품목명을 입력하세요'
              className='pr-8'
            />

            {showDropdown && (
              <div className='absolute z-20 mt-2 w-full overflow-hidden rounded-lg border bg-popover shadow-md'>
                <div className='max-h-60 overflow-auto py-1'>
                  {itemsLoading ? (
                    <div className='px-3 py-2 text-sm text-muted-foreground'>
                      검색 중...
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className='px-3 py-2 text-sm text-muted-foreground'>
                      검색 결과가 없습니다
                    </div>
                  ) : (
                    filteredItems.map((it) => (
                      <button
                        key={it.id}
                        type='button'
                        onClick={() => onSelectItem(it)}
                        className='w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground'
                      >
                        {it.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <p className='text-xs text-muted-foreground'>
            검색 후 목록에서 클릭하면 품목이 추가됩니다.
          </p>
        </div>

        {/* 선택된 품목 */}
        {MOCK_SELECTED_ITEMS_SUPPLIER.length > 0 ? (
          <div className='space-y-2'>
            <div className='text-sm font-medium'>선택된 품목</div>

            <div className='grid gap-2'>
              {MOCK_SELECTED_ITEMS_SUPPLIER.map((x) => (
                <div
                  key={x.itemId}
                  className='flex items-center gap-2 rounded-lg border p-2'
                >
                  <div className='min-w-0 flex-1'>
                    <div className='truncate text-sm'>{x.itemName}</div>
                  </div>

                  {vendorType === 'Supplier' && (
                    <Input
                      value={String(x.unitPrice ?? 0)}
                      onChange={onChangeUnitPrice(x.itemId)}
                      placeholder='단가'
                      inputMode='numeric'
                      className='w-35'
                    />
                  )}

                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => onRemoveItem(x.itemId)}
                    className='shrink-0'
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>

            {vendorType === 'Supplier' && (
              <p className='text-xs text-muted-foreground'>
                모든 품목의 단가를 1원 이상 입력해야 등록할 수 있어요.
              </p>
            )}
          </div>
        ) : (
          <div className='rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground'>
            아직 선택된 품목이 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
