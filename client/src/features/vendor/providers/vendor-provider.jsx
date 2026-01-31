import { createContext, useContext } from 'react';
import { useVendorSearch } from '@/features/vendor/hooks/use-vendor-search';
import { useVendors } from '@/features/vendor/hooks/use-vendors';

/**
 * @typedef {ReturnType<typeof useVendors>} VendorQuery
 */

/**
 * @typedef {object} VendorContextValue
 * @property {VendorQuery} query
 * @property {VendorSearch} search
 * @property {(next: Partial<VendorSearch>) => void} setSearch
 */

const VendorContext = createContext(
  /** @type {VendorContextValue | null} */ (null)
);

/**
 * 거래처에서 가져온 목록과 URL 패스에서 가져온 쿼리를 Provider로 내려줌
 */
export const VendorProvider = ({ children }) => {
  const { search, setSearch } = useVendorSearch();
  const query = useVendors(search);

  return (
    <VendorContext.Provider value={{ query, search, setSearch }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendorContext = () => {
  const ctx = useContext(VendorContext);
  if (!ctx) {
    throw new Error('useVendorContext must be used within VendorProvider');
  }
  return ctx;
};
