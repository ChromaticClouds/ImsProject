// @ts-check

import { useState } from 'react';

/**
 * @template T
 * @import { RefetchOptions, QueryObserverResult } from '@tanstack/react-query';
 */

export const useDebounceFetch = (
  /** @type {(options?: RefetchOptions) => Promise<QueryObserverResult<T, Error>>} */
  refresh
) => {
  const [refreshPending, setRefreshPending] = useState(false);

  return {
    refreshPending,
    handleRefresh: async () => {
      setRefreshPending(true);

      try {
        await Promise.all([
          refresh(),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);
      } finally {
        setRefreshPending(false);
      }
    },
  };
};
