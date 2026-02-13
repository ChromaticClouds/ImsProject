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
 * @property {number} selectedVendorId
 * @property {React.Dispatch<React.SetStateAction<number>>} setSelectedVendorId
 * @property {VendorDetail} supplier
 */

/**
 * @type {React.Context<PoContextState>}
 */
const PoPostContext = createContext(null);

export const usePoContext = () => {
  const ctx = useContext(PoPostContext);
  if (!ctx) throw new Error('PoPostContext is not provided');
  return ctx;
};

export const PurchaseOrderPostProvider = ({ children }) => {
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  
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
