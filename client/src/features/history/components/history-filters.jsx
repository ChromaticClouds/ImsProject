// @ts-check
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { HISTORY_STATUS_OPTIONS, PRODUCT_TYPE_OPTIONS, toKoreanType } from '@/constants/index.js';
import { useHistoryBrands } from '../hooks/use-history-brands.js';

export function HistoryFilters({ status, setStatus, type, setType, brand, setBrand }) {
  const brandsQ = useHistoryBrands(type);
  const brands = Array.isArray(brandsQ.data) ? brandsQ.data : [];

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {/* 유형 */}
      <Select value={status} onValueChange={(v) => setStatus(v)}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder="유형" />
        </SelectTrigger>
        <SelectContent>
          {HISTORY_STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 주종 */}
      <Select
        value={type || 'ALL'}
        onValueChange={(v) => {
          if (v === 'ALL') {
            setType('');
            setBrand('');
            return;
          }
          setType(v);
          setBrand('');
        }}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="주종" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">주종</SelectItem>
          {PRODUCT_TYPE_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 브랜드 */}
      <Select
        value={brand || 'ALL'}
        onValueChange={(v) => setBrand(v === 'ALL' ? '' : v)}
        disabled={!type}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="브랜드" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">브랜드</SelectItem>
          {brands.map((b) => (
            <SelectItem key={b} value={b}>{b}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
