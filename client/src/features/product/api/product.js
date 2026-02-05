

// export const fetchProductList = (params) =>
//   api.get('api/product', { searchParams: params }).json();

import { api } from "@/services/api";

// export const fetchProductDetail = (id) =>
//   api.get(`api/product/${id}`).json();


// 상품 목록 조회
export const fetchProducts = () => api.get('product').json();