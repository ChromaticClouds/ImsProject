

// @ts-check
import { useMemo, useState } from 'react';
import { useVendorSearch } from '@/features/vendor/hooks/use-vendor-search';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ALL_VALUE = 'ALL';

/**
 * @typedef {{ label: string, value: string }} Option
 */

export function VendorSearch({
  /** @type {Option[]} */
  typeOptions = [
    { label: '전체', value: '' }, // 기존 API 호환: '' 로 들어와도 OK
    { label: '공급처', value: 'Supplier' },
    { label: '판매처', value: 'Seller' },
  ],
  keywordPlaceholder = '검색어를 입력하세요',
}) {
  const { search, setSearch } = useVendorSearch();

  const [inputValue, setInputValue] = useState(search.keyword ?? '');
  const [isComposing, setIsComposing] = useState(false);

  // SelectItem
  const normalizedTypeOptions = useMemo(() => {
    return typeOptions.map((opt) => ({
      ...opt,
      value: opt.value === '' ? ALL_VALUE : String(opt.value),
    }));
  }, [typeOptions]);

  // store 값(undefined/Supplier/Seller) -> Select 값(ALL_VALUE/Supplier/Seller)
  const selectTypeValue = search.type ? String(search.type) : ALL_VALUE;

  /** @param {string} v */
  const onValueChangeType = (v) => {
    
    const nextType = v === ALL_VALUE ? undefined : v;
    setSearch({ type: nextType, page: 1 });
  };

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  const onChangeKeyword = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (!isComposing) {
      setSearch({ keyword: val, page: 1 });
    }
  };

  const onCompositionStart = () => setIsComposing(true);

  /** @param {React.CompositionEvent<HTMLInputElement>} e */
  const onCompositionEnd = (e) => {
    setIsComposing(false);
    setSearch({ keyword: e.currentTarget.value, page: 1 });
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* 타입 */}
      <div className="grid gap-1">
        <Label className="text-xs text-muted-foreground">구분</Label>

        <Select value={selectTypeValue} onValueChange={onValueChangeType}>
          <SelectTrigger className="h-10 min-w-[150px] rounded-xl">
            {/* 전체를 목록에도 넣을 거지만, placeholder도 동일하게 두면 자연스러움 */}
            <SelectValue placeholder="전체" />
          </SelectTrigger>

          <SelectContent className="rounded-xl p-1">
            {normalizedTypeOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value} // 
                className="
                  rounded-lg
                  text-sm
                  data-[highlighted]:bg-muted
                  data-[state=checked]:bg-primary/10
                  data-[state=checked]:font-semibold
                "
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 검색어 */}
      <div className="grid gap-1 flex-1 min-w-[220px]">
        <Label className="text-xs text-muted-foreground">검색</Label>
        <Input
          value={inputValue}
          placeholder={keywordPlaceholder}
          onChange={onChangeKeyword}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          className="h-10 rounded-xl"
        />
      </div>
    </div>
  );
}
