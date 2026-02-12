// @ts-check

import { useQuery } from '@tanstack/react-query';
import { searchPoProducts } from '../api/index.js';

/**
 * @typedef {object} SearchQuery
 * @property {number} id
 * @property {boolean} open
 * @property {string} keyword
 */

/**
 * @param {SearchQuery} props
 */
export const usePoSearchQuery = ({ id, open, keyword }) => {
  return useQuery({
    queryKey: ['purchase-order', 'search', id, keyword],
    queryFn: async () => {
      const response = await searchPoProducts(id, keyword);
      return response?.data;
    },
    enabled: !!id && open
  });
};
