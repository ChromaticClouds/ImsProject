// // @ts-check

import ky from 'ky';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';
import { afterResponseHooks } from '@/services/api/after-response-hooks.js';

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_SERVER_URL,
  timeout: 30000,
  credentials: 'include',
  retry: 0,
}); // 기본 API 클라이언트

/** @type {import('ky').Hooks} */
export const hooks = {
  beforeRequest: [
    (request) => {
      const accessToken = useAuthStore.getState().accessToken;

      if (accessToken) {
        request.headers.set('Authorization', `Bearer ${accessToken}`);
      }
    },
  ],
  afterResponse: afterResponseHooks
}

export const fetchItems = async (params) => {
  // params: { keyword: string, excludeAssigned: boolean }
  const search = new URLSearchParams();
  if (params?.keyword) search.set('keyword', params.keyword);
  if (params?.excludeAssigned) search.set('excludeAssigned', 'true');

  return await api.get(`items?${search.toString()}`).json();
};

export const createVendor = async (data) => {
  return await api.post('vendor', { json: data }).json();
};

// product 검색
export const fetchProducts = async ({ keyword, excludeAssigned = true }) => {
  const qs = new URLSearchParams();
  if (keyword) qs.set('keyword', keyword);
  if (excludeAssigned) qs.set('excludeAssigned', 'true');
  return await api.get(`vendor/products?${qs.toString()}`).json();
};

// 거래처 등록 - vendor_item 저장
export const createVendorItems = async (items) => {
  // items: [{ vendor_id, product_id, purchase_price }, ...]
  return await api.post('vendor-items', { json: { items } }).json();
};

// 벌크가 없을시 단건 저장용
export const createVendorItem = async (data) => {
  // data: { vendor_id, product_id, purchase_price }
  return await api.post('vendor-item', { json: data }).json();
};

// 거래처 삭제(soft delete: status=DELETED)
export const deleteVendor = async (id) => {
  return await api.delete(`vendor/${id}`).json();
};

// 거래처 수정
export const updateVendor = async (id, data) => {
  return await api.put(`vendor/${id}`, { json: data }).json();
};


/**
 * 입고 - pending summary
 * @param {{ from: string, to: string, keyword?: string, page?: number, size?: number }} params
 */
export async function fetchInboundPendingSummary(params) {
  return await api
    .get('api/inbounds/pending/summary', { searchParams: params })
    .json();
}

/**
 * 입고 - pending items
 * @param {string} orderNumber
 */
export async function fetchInboundPendingItems(orderNumber) {
  return await api
    .get(`api/inbounds/pending/${encodeURIComponent(orderNumber)}/items`)
    .json();
}

/**
 * 입고 - pending detail
 * @param {string} orderNumber
 */
export async function fetchInboundPendingDetail(orderNumber) {
  return await api
    .get(`api/inbounds/pending/${encodeURIComponent(orderNumber)}`)
    .json();
}

/**
 * 입고 - pending update
 * @param {string} orderNumber
 * @param {any} data
 */
export async function updateInboundPending(orderNumber, data) {
  return await api
    .patch(`api/inbounds/pending/${encodeURIComponent(orderNumber)}`, { json: data })
    .json();
}

/**
 * 입고 - complete by order id
 * @param {number} orderId
 */
export async function completeInboundOrder(orderId) {
  return await api
    .patch(`api/inbounds/orders/${encodeURIComponent(orderId)}/complete`)
    .json();
}

/**
 * 입고 - complete by order number
 * @param {string} orderNumber
 * @param {{ memo?: string, receivedAt?: string }=} body
 */
export async function completeInboundByOrderNumber(orderNumber, body) {
  return await api
    .patch(`api/inbounds/orders/by-number/${encodeURIComponent(orderNumber)}/complete`, {
      json: body ?? {},
    })
    .json();
}

/**
 * 입고 - completed today summary
 * @param {{ keyword?: string, page?: number, size?: number }} params
 */
export async function fetchInboundCompletedTodaySummary(params) {
  return await api
    .get('api/inbounds/completed/today/summary', {
      searchParams: {
        keyword: params?.keyword ?? '',
        page: String(params?.page ?? 0),
        size: String(params?.size ?? 20),
      },
    })
    .json();
}

/**
 * 입고 - completed items
 * @param {string} orderNumber
 */
export async function fetchInboundCompletedItems(orderNumber) {
  return await api
    .get(`api/inbounds/completed/${encodeURIComponent(orderNumber)}/items`)
    .json();
}


/** @typedef {{ from: string, to: string, userId?: number, page?: number, size?: number }} OutboundPendingSummaryParams */
export async function fetchOutboundPendingSummary(params) {
  return await api.get('api/outbounds/pending/summary', { searchParams: params }).json();
}

/** @param {string} orderNumber */
export async function fetchOutboundPendingItems(orderNumber) {
  return await api.get(`api/outbounds/pending/${encodeURIComponent(orderNumber)}/items`).json();
}

/**
 * @typedef {{ page?: number, size?: number }} OutboundCompletedTodaySummaryParams
 */
export async function fetchOutboundCompletedTodaySummary(params) {
  return await api.get('api/outbounds/completed/today/summary', { searchParams: params }).json();
}

/** @param {string} orderNumber */
export async function fetchOutboundCompletedItems(orderNumber) {
  return await api.get(`api/outbounds/completed/${encodeURIComponent(orderNumber)}/items`).json();
}

/**
 * 출고 완료 (orderNumber)
 * @param {string} orderNumber
 * @param {{ memo?: string }=} body
 */
export const completeOutboundByOrderNumber = async (orderNumber, body = {}) => {
  return await api
    .patch(`api/outbounds/orders/by-number/${encodeURIComponent(orderNumber)}/complete`, {
      json: body,
    })
    .json();
};

export async function fetchOutboundAssignees() {
  return await api.get('api/outbounds/assignees').json();
}

export async function fetchOutboundStockTypes() {
  const res = await api.get('api/outbounds/stock/types').json();
  return res.data;
}

/** @param {{ type: string }} params */
export async function fetchOutboundStockBrands(params) {
  const res = await api.get('api/outbounds/stock/brands', { searchParams: params }).json();
  return res.data;
}

/** @param {{ type: string, brand: string }} params */
export async function fetchOutboundStockProducts(params) {
  const res = await api.get('api/outbounds/stock/products', { searchParams: params }).json();
  return res.data;
}