// @ts-check
import {
  ArrowLeft,
  BottleWineIcon,
  Building2,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Trash2,
  UserRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────

/** @param {number | null | undefined} value */
const money = (value) =>
  `${Number(value ?? 0).toLocaleString('ko-KR')}원`;

const vendorTypeLabel = {
  Supplier: '공급처',
  Seller: '판매처',
};

// ─────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────

/**
 * @typedef {{
 *   type: 'Supplier' | 'Seller';
 *   bossName?: string;
 *   vendorName?: string;
 *   telephone?: string;
 *   email?: string;
 *   address?: string;
 *   memo?: string;
 * }} Vendor
 *
 * @typedef {{
 *   productId?: number | string;
 *   productName?: string;
 *   brand?: string;
 *   type?: string;
 *   purchasePrice?: number;
 *   imageUrl?: string;
 * }} ProductItem
 */

// ─────────────────────────────────────────────
// 서브 컴포넌트
// ─────────────────────────────────────────────

/**
 * 상단 KPI 타일 3개 — 공급 품목 수 / 최저 단가 / 최고 단가
 * 공급처일 때만 렌더링되므로 isSupplier 분기 없음
 * @param {{ itemCount: number; minPrice: number | null; maxPrice: number | null }} props
 */
function KpiRow({ itemCount, minPrice, maxPrice }) {
  const dash = <span className='text-sm font-medium'>—</span>;

  return (
    <div className='grid grid-cols-3 gap-2.5 sm:gap-3'>
      {/* 공급 품목 수: 거래 의존 범위 */}
      <div className='rounded-md bg-muted/60 px-3 py-3'>
        <p className='text-xs text-muted-foreground'>공급 품목</p>
        <p className='mt-1.5 text-lg font-medium leading-none'>
          {itemCount}
          <span className='ml-0.5 text-xs font-normal text-muted-foreground'>개</span>
        </p>
      </div>

      {/* 최저 단가: 이 공급처의 가격 경쟁력 하한 */}
      <div className='rounded-md bg-muted/60 px-3 py-3'>
        <p className='text-xs text-muted-foreground'>최저 단가</p>
        {minPrice !== null ? (
          <>
            <p className='mt-1.5 text-base font-medium leading-none tabular-nums'>
              {minPrice.toLocaleString('ko-KR')}
              <span className='ml-0.5 text-xs font-normal text-muted-foreground'>원</span>
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>가장 저렴한 품목</p>
          </>
        ) : (
          <p className='mt-1.5'>{dash}</p>
        )}
      </div>

      {/* 최고 단가: 고가 품목 취급 여부 → 마진 설계 기준 */}
      <div className='rounded-md bg-muted/60 px-3 py-3'>
        <p className='text-xs text-muted-foreground'>최고 단가</p>
        {maxPrice !== null ? (
          <>
            <p className='mt-1.5 text-base font-medium leading-none tabular-nums'>
              {maxPrice.toLocaleString('ko-KR')}
              <span className='ml-0.5 text-xs font-normal text-muted-foreground'>원</span>
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>가장 비싼 품목</p>
          </>
        ) : (
          <p className='mt-1.5'>{dash}</p>
        )}
      </div>
    </div>
  );
}

/**
 * 기본 정보 행 (아이콘 박스 + 라벨 + 값)
 * @param {{ icon: React.ElementType; label: string; value?: string }} props
 */
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className='flex items-start gap-3 border-b py-2.5 last:border-b-0'>
      <div className='flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60 mt-0.5'>
        <Icon className='size-3.5 text-muted-foreground' aria-hidden='true' />
      </div>
      <div className='min-w-0'>
        <p className='text-xs text-muted-foreground'>{label}</p>
        <p className='mt-0.5 text-sm font-medium break-all'>
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

/**
 * 공급 품목 행
 * @param {{ item: ProductItem }} props
 */
function ProductRow({ item }) {
  const meta = [item.brand, item.type].filter(Boolean).join(' · ') || '—';

  return (
    <div className='flex items-center gap-3 border-b py-2.5 last:border-b-0'>
      {/* 썸네일 */}
      <div className='flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40'>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className='size-full object-cover'
          />
        ) : (
          <BottleWineIcon
            className='size-4 text-muted-foreground'
            aria-hidden='true'
          />
        )}
      </div>

      {/* 품목 정보 */}
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>
          {item.productName ?? '—'}
        </p>
        <p className='mt-0.5 truncate text-xs text-muted-foreground'>{meta}</p>
      </div>

      {/* 단가 */}
      <p className='shrink-0 text-sm font-medium tabular-nums'>
        {money(item.purchasePrice)}
      </p>
    </div>
  );
}

/**
 * 빈 상태
 * @param {{ message: string }} props
 */
function EmptyState({ message }) {
  return (
    <div className='flex min-h-36 flex-col items-center justify-center gap-2 rounded-md bg-muted/20 text-muted-foreground'>
      <Package className='size-5' aria-hidden='true' />
      <p className='text-sm'>{message}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────

/**
 * @param {{
 *   vendor: Vendor;
 *   items?: ProductItem[];
 *   onBack?: () => void;
 *   onEdit?: () => void;
 *   onDelete?: () => void;
 * }} props
 */
export function VendorDetailRenewal({
  vendor,
  items = [],
  onBack,
  onEdit,
  onDelete,
}) {
  const isSupplier = vendor.type === 'Supplier';
  const typeLabel = vendorTypeLabel[vendor.type] ?? vendor.type ?? '—';

  const prices = items.map((item) => Number(item.purchasePrice ?? 0));
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  return (
    <div className='min-h-[calc(100vh-64px)] bg-muted/40'>
      <div className='mx-auto max-w-300 px-5 py-6'>

        {/* ── 헤더 ── */}
        <header className='mb-5 flex flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between'>
          <div className='min-w-0'>
            <div className='mb-3 flex items-center gap-2'>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                aria-label='뒤로가기'
                onClick={onBack}
              >
                <ArrowLeft />
              </Button>
              <Badge variant={isSupplier ? 'default' : 'secondary'}>
                {typeLabel}
              </Badge>
            </div>

            <h1 className='truncate text-2xl font-semibold tracking-normal'>
              {vendor.vendorName ?? '거래처 상세'}
            </h1>
            <p className='mt-1.5 text-sm text-muted-foreground'>
              {isSupplier
                ? '기본 정보와 공급 품목 단가를 확인합니다.'
                : '거래처 기본 정보를 확인합니다.'}
            </p>
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <Button type='button' variant='outline' onClick={onEdit}>
              <Pencil />
              수정
            </Button>
            <Button
              type='button'
              variant='outline'
              className='text-destructive hover:text-destructive'
              onClick={onDelete}
            >
              <Trash2 />
              삭제
            </Button>
          </div>
        </header>

        {/* ── KPI 타일 — 공급처일 때만 표시 ── */}
        {isSupplier && (
          <KpiRow
            itemCount={items.length}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        )}

        {/* ── 본문 ── */}
        {isSupplier ? (
          /* 공급처: 기본정보+메모(7) / 공급품목(5) 2컬럼 */
          <div className='mt-4 grid grid-cols-12 items-stretch gap-4'>

            <section className='col-span-12 flex flex-col gap-4 lg:col-span-7'>
              <div className='rounded-lg border bg-card'>
                <div className='flex items-center justify-between border-b px-5 py-4'>
                  <div>
                    <h2 className='text-sm font-medium'>기본 정보</h2>
                    <p className='mt-0.5 text-xs text-muted-foreground'>
                      담당자 · 연락처 · 주소
                    </p>
                  </div>
                  <Building2 className='size-4 text-muted-foreground' aria-hidden='true' />
                </div>
                <div className='px-5 py-3'>
                  <InfoRow icon={Building2} label='거래처명' value={vendor.vendorName} />
                  <InfoRow icon={UserRound} label='대표자명' value={vendor.bossName} />
                  <InfoRow icon={Phone}     label='전화번호'  value={vendor.telephone} />
                  <InfoRow icon={Mail}      label='이메일'    value={vendor.email} />
                  <InfoRow icon={MapPin}    label='주소'      value={vendor.address} />
                </div>
              </div>

              <div className='rounded-lg border bg-card'>
                <div className='border-b px-5 py-4'>
                  <h2 className='text-sm font-medium'>메모</h2>
                </div>
                <div className='min-h-28 whitespace-pre-wrap px-5 py-4 text-sm leading-6 text-muted-foreground'>
                  {vendor.memo || '등록된 메모가 없습니다.'}
                </div>
              </div>
            </section>

            <aside className='col-span-12 flex h-full flex-col lg:col-span-5'>
              <div className='flex h-full flex-col rounded-lg border bg-card'>
                <div className='flex shrink-0 items-center justify-between border-b px-5 py-4'>
                  <div>
                    <h2 className='text-sm font-medium'>공급 품목</h2>
                    <p className='mt-0.5 text-xs text-muted-foreground'>구매 단가 기준</p>
                  </div>
                  <Package className='size-4 text-muted-foreground' aria-hidden='true' />
                </div>
                <div className='min-h-0 flex-1 overflow-y-auto px-5 py-3'>
                  {items.length === 0 ? (
                    <EmptyState message='등록된 공급 품목이 없습니다.' />
                  ) : (
                    items.map((item) => (
                      <ProductRow
                        key={item.productId ?? item.productName}
                        item={item}
                      />
                    ))
                  )}
                </div>
              </div>
            </aside>

          </div>
        ) : (
          /* 판매처: 기본정보(좌) + 메모(우) 전체 너비 2컬럼 */
          <div className='mt-4 grid grid-cols-12 gap-4'>

            <section className='col-span-12 lg:col-span-7'>
              <div className='rounded-lg border bg-card'>
                <div className='flex items-center justify-between border-b px-5 py-4'>
                  <div>
                    <h2 className='text-sm font-medium'>기본 정보</h2>
                    <p className='mt-0.5 text-xs text-muted-foreground'>
                      담당자 · 연락처 · 주소
                    </p>
                  </div>
                  <Building2 className='size-4 text-muted-foreground' aria-hidden='true' />
                </div>
                <div className='px-5 py-3'>
                  <InfoRow icon={Building2} label='거래처명' value={vendor.vendorName} />
                  <InfoRow icon={UserRound} label='대표자명' value={vendor.bossName} />
                  <InfoRow icon={Phone}     label='전화번호'  value={vendor.telephone} />
                  <InfoRow icon={Mail}      label='이메일'    value={vendor.email} />
                  <InfoRow icon={MapPin}    label='주소'      value={vendor.address} />
                </div>
              </div>
            </section>

            <aside className='col-span-12 lg:col-span-5'>
              <div className='rounded-lg border bg-card'>
                <div className='border-b px-5 py-4'>
                  <h2 className='text-sm font-medium'>메모</h2>
                </div>
                <div className='min-h-28 whitespace-pre-wrap px-5 py-4 text-sm leading-6 text-muted-foreground'>
                  {vendor.memo || '등록된 메모가 없습니다.'}
                </div>
              </div>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
}
