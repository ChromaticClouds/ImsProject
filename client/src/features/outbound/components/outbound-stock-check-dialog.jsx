// @ts-check
import { useEffect, useMemo, useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.js';

/** @typedef {{ id: number|string, name?: string, productCode?: string, type?: string, brand?: string, volume?: string, stockCount?: number }} StockProduct */

import { useOutboundStockTypes } from '../hooks/use-outbound-stock-types.js';
import { useOutboundStockBrands } from '../hooks/use-outbound-stock-brands.js';
import { useOutboundStockProducts } from '../hooks/use-outbound-stock-products.js';

/**
 * @param {{
 *  open: boolean,
 *  onOpenChange: (next: boolean) => void
 * }} props
 */
export function OutboundStockCheckDialog({ open, onOpenChange }) {
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [productId, setProductId] = useState('');

  const typesQ = useOutboundStockTypes(open);
  const types = Array.isArray(typesQ.data) ? typesQ.data : [];

  const brandsQ = useOutboundStockBrands({ type }, open);
  const brands = Array.isArray(brandsQ.data) ? brandsQ.data : [];

  const productsQ = useOutboundStockProducts({ type, brand }, open);
  const products = Array.isArray(productsQ.data) ? productsQ.data : [];

  const selectedProduct = useMemo(() => {
    const idNum = Number(productId);
    return products.find((p) => Number(p.id) === idNum) || null;
  }, [productId, products]);

  useEffect(() => {
    if (!open) return;
    setType('');
    setBrand('');
    setProductId('');
  }, [open]);

  useEffect(() => {
    setBrand('');
    setProductId('');
  }, [type]);

  useEffect(() => {
    setProductId('');
  }, [brand]);

  const close = () => onOpenChange(false);

  if (!open) return null;

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-[760px] max-w-[95vw] overflow-hidden rounded-2xl border bg-secondary shadow-2xl">
        {/* Header */}
        <div className="relative flex items-center justify-center border-b bg-background px-4 py-3">
          <div className="text-base font-extrabold tracking-tight">현재고 확인</div>

          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-xl border bg-secondary hover:bg-muted/40"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[170px_1fr_1.2fr]">
          {/* Types */}
          <div className="border-b md:border-b-0 md:border-r bg-muted/10 p-3">
            <div className="mb-2 text-xs font-semibold text-muted-foreground">주종</div>

            <div className="grid gap-1">
              {typesQ.isLoading ? (
                <div className="rounded-xl border bg-secondary px-3 py-2 text-sm text-muted-foreground">
                  로딩 중...
                </div>
              ) : typesQ.isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  오류 발생
                </div>
              ) : types.length === 0 ? (
                <div className="rounded-xl border bg-secondary px-3 py-2 text-sm text-muted-foreground">
                  데이터 없음
                </div>
              ) : (
                types.map((t) => {
                  const active = type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={[
                        'flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-semibold transition',
                        active
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'bg-secondary hover:bg-muted/40',
                      ].join(' ')}
                    >
                      <span>{toKoreanType(t)}</span>
                      {active ? <Check className="h-4 w-4" /> : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Brands */}
          <div className="border-b md:border-b-0 md:border-r p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-muted-foreground">브랜드</div>
              {type ? (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {toKoreanType(type)}
                </span>
              ) : null}
            </div>

            {!type ? (
              <div className="rounded-xl border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                주종을 선택하세요
              </div>
            ) : brandsQ.isLoading ? (
              <div className="rounded-xl border bg-secondary px-3 py-2 text-sm text-muted-foreground">
                로딩 중...
              </div>
            ) : brandsQ.isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                오류 발생
              </div>
            ) : brands.length === 0 ? (
              <div className="rounded-xl border bg-secondary px-3 py-2 text-sm text-muted-foreground">
                브랜드 없음
              </div>
            ) : (
              <div className="grid max-h-[340px] gap-1 overflow-auto pr-1">
                {brands.map((b) => {
                  const active = brand === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBrand(b)}
                      className={[
                        'rounded-xl border px-3 py-2 text-left text-sm font-semibold transition',
                        active
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'bg-secondary hover:bg-muted/40',
                      ].join(' ')}
                      title={b}
                    >
                      <div className="truncate">{b}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Products */}
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-muted-foreground">제품</div>
              {type && brand ? (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {brand}
                </span>
              ) : null}
            </div>

            {!type || !brand ? (
              <div className="rounded-xl border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                주종/브랜드를 선택하세요
              </div>
            ) : productsQ.isLoading ? (
              <div className="rounded-xl border bg-secondary px-3 py-2 text-sm text-muted-foreground">
                로딩 중...
              </div>
            ) : productsQ.isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                오류 발생
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-xl border bg-secondary px-3 py-2 text-sm text-muted-foreground">
                제품 없음
              </div>
            ) : (
              <div className="grid max-h-[340px] gap-1 overflow-auto pr-1">
                {products.map((p) => {
                  const active = Number(productId) === Number(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProductId(String(p.id))}
                      className={[
                        'rounded-xl border px-3 py-2 text-left text-sm font-semibold transition',
                        active
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'bg-secondary hover:bg-muted/40',
                      ].join(' ')}
                      title={formatProductLabel(p)}
                    >
                      <div className="truncate">{formatProductLabel(p)}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer / Summary */}
        <div className="border-t bg-muted/10 px-4 py-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-muted-foreground">
                선택 제품 : &nbsp; {selectedProduct ? formatProductLabel(selectedProduct) : '-'}
              </div>
             
                
              
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border bg-secondary px-4 py-2 text-center">
                <div className="text-[11px] font-semibold text-muted-foreground">
                    현재고 : &nbsp; {selectedProduct ? Number(selectedProduct.stockCount ?? 0).toLocaleString() : '-'}    
                </div>
                
              </div>

              <Button type="button" variant="outline" onClick={close}>
                닫기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @param {StockProduct} product */
function formatProductLabel(product) {
  const parts = [product.productCode, product.name].filter(Boolean);
  return parts.join(' · ') || '제품명 없음';
}

/** @param {string} type */
function toKoreanType(type) {
  switch (type) {
    case 'SOJU':
      return '소주';
    case 'WHISKEY':
      return '위스키';
    case 'LIQUOR':
      return '양주';
    case 'TRADITIONAL':
      return '전통주';
    case 'KAOLIANG_LIQUOR':
      return '고량주';
    default:
      return type;
  }
}
