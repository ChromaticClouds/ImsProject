import { useState } from 'react';
import { useVendorSearch } from '@/features/vendor/hooks/use-vendor-search';

export function VendorSearch({
  typeOptions = [
    { label: '전체', value: '' },
    { label: '공급처', value: 'Supplier' },
    { label: '판매처', value: 'Seller' },
  ],
  keywordPlaceholder = '검색어를 입력하세요',
}) {
  const { search, setSearch } = useVendorSearch();

  const [inputValue, setInputValue] = useState(search.keyword ?? '');
  const [isComposing, setIsComposing] = useState(false);

  const onChangeType = (e) => {
    const nextType = e.target.value;
    setSearch({ type: nextType || undefined, page: 1 });
  };

  const onChangeKeyword = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (!isComposing) {
      setSearch({ keyword: val, page: 1 });
    }
  };

  const onCompositionStart = () => setIsComposing(true);

  const onCompositionEnd = (e) => {
    setIsComposing(false);

    setSearch({ keyword: e.target.value, page: 1 });
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select value={search.type ?? ''} onChange={onChangeType}>
        {typeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <input
        value={inputValue}
        placeholder={keywordPlaceholder}
        onChange={onChangeKeyword}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
      />
    </div>
  );
}
