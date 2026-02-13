// @ts-check

import { useSearchParams } from "react-router-dom"

/**
 * @typedef {object} CategoryFilterType
 * @property {string[]} selected
 * @property {(value: string | string[], checked: boolean) => void} toggleType
 * @property {() => void} clearType
 */

/**
 * 선택한 카테고리에 따라 URL 쿼리를 제어
 * @param {string} key
 * @returns {CategoryFilterType}
 */
export const useCategoryFilter = (key) => {
  const [params, setParams] = useSearchParams();

  const selected = params.get(key)
    ?.split(',').filter(Boolean) ?? [];

  return {
    selected,

    toggleType: (value, checked) => {
      const set = new Set(selected);
      const values = Array.isArray(value) ? value : [value];

      values.forEach((v) => 
        checked ? set.add(v) : set.delete(v)
      );

      if (set.size === 0) params.delete(key);
      else params.set(key, [...set].join(','));

      params.set('page', '1');
      setParams(params);
    },

    clearType: () => {
      const next = new URLSearchParams(params);
      next.delete(key);
      next.set('page', '1');

      setParams(next);
    }
  }
}