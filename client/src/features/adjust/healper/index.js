// @ts-check

import { useAdjustContext } from '../providers/adjust-provider.jsx';

/**
 * @param {ReturnType<typeof useAdjustContext>['form']} form
 * @param {ProductSuggest} product
 */
export const addOrIncreaseProduct = (form, product) => {
  const { productId, count: currentStock, ...rest } = product;

  form.setFieldValue('products', (prev) => {
    const key = productId;

    const map = new Map(prev.map((p) => [p.id, p]));

    if (map.has(key)) {
      const prevItem = map.get(key);
      map.set(key, {
        ...prevItem,
        adjustCount: (prevItem.adjustCount ?? 0) + 1,
      });
    } else {
      map.set(key, {
        ...rest,
        id: productId,
        currentStock,
        adjustCount: 1,
      });
    }

    return Array.from(map.values());
  });
};
