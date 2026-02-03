// @ts-check
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVendorForm } from '../hooks/use-vendor-form.js';

/**
 * @param {{
 *   vendorType: 'Supplier' | 'Seller'
 *   form: ReturnType<typeof useVendorForm>
 *   itemKeyword: string
 *   setItemKeyword: (v: string) => void
 *   itemsLoading: boolean
 *   items: { id: number, name: string }[]
 *   onSelectItem: (item: { id: number, name: string }) => void
 *   onRemoveItem: (index: number) => void
 * }} props
 */

export function SupplierItemsSection({
  form,
  vendorType,
  itemKeyword,
  setItemKeyword,
  itemsLoading,
  items,
  onSelectItem,
  onRemoveItem,
}) {
  const showDropdown = itemKeyword.trim().length > 0;

  if (vendorType !== 'Supplier') return null;

  return (
    <Card className='border-dashed'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base flex items-center gap-2'>
          공급처 품목
          <form.Subscribe selector={(s) => s.values.items}>
            {(selectedItems) => (
              <Badge variant='secondary' className='font-normal'>
                {selectedItems.length}개 선택됨
              </Badge>
            )}
          </form.Subscribe>
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        <form.Subscribe selector={(s) => s.values.items}>
          {(selectedItems) => {
            const selectedSet = new Set(
              selectedItems.map((x) => x.itemId),
            );

            const filteredItems = items.filter(
              (it) => !selectedSet.has(it.id),
            );

            return (
              <>
                {/* 검색 */}
                <div className='space-y-2'>
                  <div className='text-sm font-medium'>품목 검색</div>

                  <div className='relative'>
                    <Input
                      value={itemKeyword}
                      onChange={(e) => setItemKeyword(e.target.value)}
                      placeholder='품목명을 입력하세요'
                    />

                    {showDropdown && (
                      <div className='absolute z-20 mt-2 w-full rounded-lg border bg-popover shadow-md'>
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
                                className='w-full px-3 py-2 text-left text-sm hover:bg-accent'
                              >
                                {it.name}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 선택된 품목 */}
                {selectedItems.map((x, index) => (
                  <div
                    key={x.itemId}
                    className='flex items-center gap-2 rounded-lg border p-2'
                  >
                    <div className='flex-1 text-sm truncate'>
                      {x.itemName}
                    </div>

                    <form.Field name={`items[${index}].unitPrice`}>
                      {(field) => (
                        <Input
                          value={String(field.state.value ?? 0)}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          className='w-28 h-8'
                          inputMode='numeric'
                        />
                      )}
                    </form.Field>

                    <Button
                      type='button'
                      size='sm'
                      variant='outline'
                      onClick={() => onRemoveItem(index)}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </>
            );
          }}
        </form.Subscribe>
      </CardContent>
    </Card>
  );
}

