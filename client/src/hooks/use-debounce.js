// use-debounce.js
import { useEffect, useState } from 'react';

/**
 * @template T
 * @param {T} value
 * @param {number} delay
 */
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
};
