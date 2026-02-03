import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

/**
 * @param {{ keyword: string, onChange: () => void }} props
 */
export const ProductSearch = ({ keyword, onChange }) => {
  return (
    <div className="relative w-64">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="품목명 / 코드 / 브랜드 검색"
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};
