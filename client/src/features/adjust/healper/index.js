import { useAdjustContext } from '../providers/adjust-provider.jsx';

/**
 * @param {ReturnType<typeof useAdjustContext>} form 
 * @param {ProductSuggest} product 
 */
export const addOrIncreaseProduct = (form, product) => {
  const { productId, count: currentStock, ...rest } = product;

  form.setFieldValue('products', (prev) => {
    const map = new Map(prev.map((p) => [p.id, p]));

    if (map.has(productId)) {
      map.set(productId, {
        ...map.get(productId),
        adjustCount: map.get(productId).adjustCount + 1,
      });
    } else {
      map.set(productId, {
        id: productId,
        ...rest,
        currentStock,
        adjustCount: 1,
      });
    }

    return Array.from(map.values());
  });
};