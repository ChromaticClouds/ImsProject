// @ts-check

import { create } from 'zustand';

/**
 * @typedef {object} AdjustListState
 * @property {AdjustItem[]} products
 * @property {(product: ProductSuggest) => void} addProduct
 * @property {(id: number, value: number) => void} changeAdjustCount
 * @property {(id: number) => void} removeProduct
 * @property {() => void} clear
 * @property {() => number} getTotalAdjustCount
 */

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<AdjustListState>>}
 */
export const useAdjustListStore = create((set, get) => ({
  products: [],

  /**
   * 검색 결과를 재고조정 아이템으로 변환 후 추가
   */
  addProduct: (product) =>
    set((state) => {
      const exists = state.products.find((p) => p.id === product.productId);

      if (exists) {
        return {
          products: state.products.map((p) =>
            p.id === product.productId
              ? { ...p, adjustCount: p.adjustCount + 1 }
              : p
          ),
        };
      }

      return {
        products: [
          ...state.products,
          {
            id: product.productId,
            name: product.name,
            brand: product.brand,
            type: product.type,
            imageUrl: product.imageUrl,
            purchasePrice: product.purchasePrice,
            salePrice: product.salePrice,
            currentStock: product.count,
            adjustCount: 1,
          },
        ],
      };
    }),

  /**
   * 조정 수량 직접 수정
   */
  changeAdjustCount: (id, value) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, adjustCount: value } : p
      ),
    })),

  /**
   * 한 상품 제거
   */
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  /**
   * 전체 초기화
   */
  clear: () => set({ products: [] }),

  /**
   * 총 조정 수량 (계산용 selector)
   */
  getTotalAdjustCount: () =>
    get().products.reduce((sum, p) => sum + p.adjustCount, 0),
}));
