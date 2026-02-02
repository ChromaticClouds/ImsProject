// hooks/use-debounced-value.ts
import { useEffect, useState } from 'react';

/**
 * @template T
 * @param {T} value
 * @param {number} delay
 * @returns {T}
 */
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
