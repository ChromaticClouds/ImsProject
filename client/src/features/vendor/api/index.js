// @ts-check
import { api } from '@/services/api.js';

/**
 * @param {VendorSearch} params
 * @returns {Promise<VendorListResponse>}
 */
export const fetchVendors = async (params) => {
  return await api.get('vendor', { searchParams: params }).json();
};

/** @param {Record<string, unknown>} data */
export const createVendor = async (data) => {
  return await api.post('vendor', { json: data }).json();
};

/** @param {number} id @param {Record<string, unknown>} data */
export const updateVendor = async (id, data) => {
  return await api.put(`vendor/${id}`, { json: data });
};

/** @param {number} id */
export const deleteVendor = async (id) => {
  return await api.delete(`vendor/${id}`).json();
};

/**
 * @typedef {object} VendorProductApi
 * @property {number=} id
 * @property {number=} productId
 * @property {string=} name
 * @property {string=} productName
 * @property {string=} brand
 * @property {ProductType=} type
 * @property {number=} purchasePrice
 * @property {string=} imageUrl
 */

/**
 * @typedef {import('../types/index.js').VendorProductType & {
 *  id: number,
 *  name: string,
 * }} NormalizedVendorProduct
 */

/**
 * @param {VendorProductApi} product
 * @returns {NormalizedVendorProduct}
 */
const normalizeVendorProduct = (product) => {
  const productId = product.productId ?? product.id ?? 0;
  const productName = product.productName ?? product.name ?? '';

  return {
    ...product,
    id: productId,
    name: productName,
    productId,
    productName,
    brand: product.brand ?? '',
    type: /** @type {ProductType} */ (product.type ?? ''),
    purchasePrice: Number(product.purchasePrice ?? 0),
    imageUrl: product.imageUrl,
  };
};

/**
 * @param {{ keyword?: string, excludeAssigned?: boolean, currentVendorId?: number }} params
 * @returns {Promise<NormalizedVendorProduct[]>}
 */
export const fetchProducts = async ({ keyword, excludeAssigned = true, currentVendorId }) => {
  const qs = new URLSearchParams();
  if (keyword) qs.set('keyword', keyword);
  if (excludeAssigned) qs.set('excludeAssigned', 'true');
  if (currentVendorId != null) qs.set('currentVendorId', String(currentVendorId));
  const products = /** @type {unknown} */ (
    await api.get(`vendor/products?${qs.toString()}`).json()
  );
  return Array.isArray(products)
    ? products.map((product) =>
        normalizeVendorProduct(/** @type {VendorProductApi} */ (product)),
      )
    : [];
};

/** @param {{ vendorId: number, productId: number }} params */
export const softDeleteVendorItem = async ({ vendorId, productId }) => {
  return await api.patch(`vendor/${vendorId}/items/${productId}`).json();
  
};

