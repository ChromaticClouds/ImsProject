import { useSearchParams } from "react-router-dom"

/**
 * 
 * @param {string} category
 * @returns {{ 
 *   toggleType: (type: string, checked: boolean) => void, 
 *   selected: string[] 
 * }}
 */
export const useCategoryFilter = (category) => {
  const [params, setParams] = useSearchParams();

  const selected = params.get(category)
    ?.split(',').filter(Boolean) ?? [];

  return {
    selected,

    toggleType: (type, checked) => {
      const next = new Set(selected);

      if (checked) next.add(type);
      else next.delete(type);

      const value = [...next].join(',');

      if (value) params.set(category, value);
      else params.delete('type');

      params.set('page', '0');
      setParams(params);
    },
  }
}