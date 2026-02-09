// @ts-check

import { useQuery } from "@tanstack/react-query"
import { getProductSearchResult } from "../api/index.js";

/**
 * @typedef {object} OrderProduct
 * @property {number} id
 * @property {string} productCode
 * @property {string} name
 * @property {number} perCount
 * @property {number} salePrice
 */

/**
 * 검색 및 다이얼로그 열람 조건에 따른 품목 조회
 * @param {string} search 
 * @param {boolean} open
 */
export const useOrderProductSearch = (search, open) => {
  return useQuery({
    queryKey: ['receive-order-products', search],
    queryFn: () => getProductSearchResult(search),
    enabled: open,
  });
}