// @ts-check

/**
 * Components
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { FieldSet } from '@/components/ui/field.js';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';

/**
 * Constants
 */
import { PURCHASE_ORDER_TABLE_HEADER } from '../../constants/index.js';

/**
 * @param {React.PropsWithChildren} props
 */
export const ToPurchaseListContainer = ({ children }) => {
  return (
    <FieldSet>
      <p className='text-xl font-semibold tracking-tight'>발주 품목 목록</p>
      <Card>
        <CardHeader className='border-b'>
          <CardTitle>품목 목록</CardTitle>
          <CardDescription>발주에 필요한 품목들을 올려주세요</CardDescription>
        </CardHeader>
        {children}
      </Card>
    </FieldSet>
  );
};
