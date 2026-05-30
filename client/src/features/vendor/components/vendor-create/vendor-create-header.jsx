import { Badge } from '@/components/ui/badge';

export function VendorCreateHeader({ type, isPending }) {
  return (
    <div className='mb-5 flex flex-wrap items-start justify-between gap-3'>
      <div>
        <div className='flex items-center gap-2'>
          <h1 className='text-xl font-semibold'>거래처 등록</h1>
          <Badge variant='secondary'>{type}</Badge>
          {isPending ? <Badge>저장 중</Badge> : null}
        </div>
        <div className='mt-1 text-sm text-muted-foreground'>
          거래처 기본 정보를 입력하고, 공급처인 경우 품목과 구매 단가를 설정하세요.
        </div>
      </div>
    </div>
  );
}
