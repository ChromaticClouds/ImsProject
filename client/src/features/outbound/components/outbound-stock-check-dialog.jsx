// @ts-check
import { useState, useMemo, useEffect, use } from 'react';
import { useOutboundStockTypes } from '../hooks/use-outbound-stock-types.js';
import { useOutboundStockBrands } from '../hooks/use-outbound-stock-brands.js';
import { useOutboundStockProducts } from '../hooks/use-outbound-stock-products.js';
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button.js';


/** @typedef {{ id: number|string, name?: string, productCode?: string, type?: string, brand?: string, volume?: string, stockCount?: number }} StockProduct */

/**
 * @param {StockProduct} product
 * @returns {string}
 */
function formatProductLabel(product) {
    const parts = [product.productCode, product.name, product.volume].filter(Boolean);
    return parts.join(' - ') || '제품명 없음';
}

/**
 * @param {{ 
 * open : boolean, 
 * onOpenChange: (next: boolean) => void, }} props
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

    useEffect(() => {
        console.log('StockCheckDialog opened:', open);
        console.log('typesQ:', typesQ);
        if (typesQ.error) console.error('typesQ error:', typesQ.error);
        console.log('types:', types);
        console.log('brandsQ:', brandsQ);
        if (brandsQ.error) console.error('brandsQ error:', brandsQ.error);
        console.log('brands:', brands);
        console.log('productsQ:', productsQ);
        if (productsQ.error) console.error('productsQ error:', productsQ.error);
        console.log('products:', products);
    }, [open, typesQ, types, brandsQ, brands, productsQ, products]);

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

    if (!open) return null;

    return (
        <div
            onMouseDown={(e) => {
                if (e.target === e.currentTarget)
                    onOpenChange(false);
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
        >
            <div
                style={{ width: 720, maxWidth: '95vw', background: '#fff', borderRadius: 10, border: '2px solid #333', overflow: 'hidden' }}
            >
                <div
                style={{position: 'relative', padding: '8px 10px', textAlign: 'center', fontWeight: 800, borderBottom: '2px solid #333'}}
                >
                현재고 확인
                <button
                    onClick={()=> onOpenChange(false)}
                    style={{
                        position: 'absolute',
                        right: 8,
                        top: 6,
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                < X size={18}/>
                </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 250px'}}>
                    <div style={{ borderRight: '2px solid #333', padding: 8}}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 6}}>주종</div>
                        <div style={{display: 'grid', gap: 6}}>
                            {typesQ.isLoading && <div style={{ fontSize: 12, color: '#999'}}>로딩 중...</div>}
                            {typesQ.isError && <div style={{ fontSize: 12, color: 'crimson'}}>오류 발생</div>}
                            {typesQ.isFetching ? <div style={{ fontSize: 12}}>불러오는 중...</div> : null }
                            {types.length === 0 && !typesQ.isLoading && <div style={{ fontSize: 12, color: '#999'}}>데이터 없음</div>}
                            {types.map((t) => (
                                <button
                                key={t}
                                onClick={() => setType(t)}
                                style={{textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', color: type === t ? '#1d4ed8' : '#111', fontWeight: type === t? 800 : 500}}
                                >
                                    {toKoreanType(t)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderRight: '2px solid #333', padding: 8}}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 6}}>
                            브랜드
                        </div>
                        {!type ? (
                            <div style={{ fontSize: 12, color: '#999'}}>주종을 선택하세요</div>
                        ) : (<div>
                            {brandsQ.isLoading && <div style={{ fontSize: 12, color: '#999'}}>로딩 중...</div>}
                            {brandsQ.isError && <div style={{ fontSize: 12, color: 'crimson'}}>오류 발생</div>}
                            {brandsQ.isFetching ? <div>불러오는 중...</div> : null }
                            {brands.length === 0 && !brandsQ.isLoading && <div style={{ fontSize: 12, color: '#999'}}>브랜드 없음</div>}
                            { brands.map((b) => (
                                <button
                                    key={b}
                                    onClick={()=>setBrand(b)}
                                    style={{textAlign: 'left', cursor: 'pointer', color: brand === b ? '#1d4ed8' : '#111', fontWeight: brand === b ? 800 : 500}}>
                                    {b}<br/>
                                    </button>
                            ))}
                        </div>)}
                    </div>

                    <div style={{ padding: 8}}>
                        <div style={{fontSize: 12, color:'#666'}}>제품</div>
                        {!type || !brand? (
                            <div style={{ fontSize: 12, color: '#999'}}>주종/브랜드 선택하세요</div>
                        ):(<div>
                            {productsQ.isLoading && <div style={{ fontSize: 12, color: '#999'}}>로딩 중...</div>}
                            {productsQ.isError && <div style={{ fontSize: 12, color: 'crimson'}}>오류 발생</div>}
                            {productsQ.isFetching ? <div>불러오는 중...</div> : null }
                            {!productsQ.isFetching && products.length === 0 ? (
                                <div style={{ fontSize: 12, color: '#999'}}>제품없음</div>) : null }
                            <div>
                                {products.map((p)=>{
                                    const active = Number(productId) === Number(p.id);
                                    return (
                
                                        <button
                                            key={p.id}
                                            onClick={() => setProductId(p.id)}
                                            style={{textAlign: 'left', cursor: 'pointer', color: active ? '#1d4ed8' : '#111', fontWeight: active ? 800 : 500}}
                                        >
                                            {p.name}
                                        </button>
                                        
                                    );
                                })}
                            </div>
                        </div>)}
                    </div>
                </div>
                <div style={{ borderTop: '2px solid #333', padding: 12, textAlign: 'center'}}>
                    <div style={{fontWeight: 700}}>
                        제품명 : {selectedProduct ? formatProductLabel(selectedProduct) : '-'}
                    </div>
                    <div style={{ marginTop: 6, fontWeight: 800}}>
                        현재고 : {selectedProduct ? Number(selectedProduct.stockCount ?? 0).toLocaleString() : '-'}
                    </div>
                    <div style={{marginTop: 10, display: 'flex', justifyContent: 'center', gap: 8}}>
                        <Button type="button" variant="outline" onClick={()=>onOpenChange(false)}>
                            닫기
                        </Button>
                    </div>
                </div>
            </div>
        </div>);


/** @param {StockProduct} p */
function formatProductLabel(p) {
  const name = p.name ?? '';
  const vol = p.volume ? ` ${p.volume}` : '';
  return `${name}${vol}`.trim();
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

}  