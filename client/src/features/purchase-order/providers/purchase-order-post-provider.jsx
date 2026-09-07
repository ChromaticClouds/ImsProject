// @ts-check

import { createContext } from 'react';
import { usePoBootstrapQuery } from '../hooks/use-po-boostrap-query.js';
import { useContext } from 'react';
import { useState } from 'react';
import { useSupplierInfoQuery } from '../hooks/use-supplier-info-query.js';

/**
 * 공급처 및 발주 번호 컨텍스트 스키마
 * @typedef {object} PoContextState
 * @property {VendorIdentifier[]} vendors
 * @property {string} sequence
 * @property {number | null} selectedVendorId
 * @property {React.Dispatch<React.SetStateAction<number | null>>} setSelectedVendorId
 * @property {VendorDetail | undefined} supplier
 */

const PoPostContext = createContext(
  /** @type {PoContextState | null} */ (null),
);

export const usePoContext = () => {
  const ctx = useContext(PoPostContext);
  if (!ctx) throw new Error('PoPostContext is not provided');
  return ctx;
};

/** @param {React.PropsWithChildren} props */
export const PurchaseOrderPostProvider = ({ children }) => {
  const [selectedVendorId, setSelectedVendorId] = useState(
    /** @type {number | null} */ (null),
  );
  
  const { data: boots } = usePoBootstrapQuery();
  const { data: supplier } = useSupplierInfoQuery(selectedVendorId);
  
  const safeParsed = {
    sequence: boots?.sequence ?? '',
    vendors: boots?.vendors ?? [],
    selectedVendorId,
    setSelectedVendorId,
    supplier
  };

  return (
    <PoPostContext.Provider value={safeParsed}>
      {children}
    </PoPostContext.Provider>
  );
};
