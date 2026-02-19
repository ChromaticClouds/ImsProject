// @ts-check

import { useQuery } from '@tanstack/react-query';
import { fetchUserGroup } from '../api/index.js';
import { keepPreviousData } from '@tanstack/react-query';

/**
 * @typedef {object} UserSearchParam
 * @property {number} page
 * @property {string} search
 */

/**
 * @param {UserSearchParam} query
 */
export const useGetUserGroup = (query) => {
  return useQuery({
    queryKey: ['user-group', query.page, query.search || ''],
    queryFn: async () => {
      const response = await fetchUserGroup(query.page, query.search);
      return response?.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: query.page >= 1,
  });
};
