import ky from "ky";

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_SERVER_URL,
  timeout: 30000,
}); // 기본 API 클라이언트

const API_BASE_URL = 'http://localhost:8080/api';
export default API_BASE_URL;


// 2. 거래처 목록 조회 (ky 활용)
export const fetchVendors = async (params = {}) => {
  // ky는 searchParams 옵션을 직접 지원해서 URLSearchParams를 수동으로 만들 필요가 없습니다.
  return await api.get('api/vendors', { searchParams: params }).json();
};

// 3. 거래처 등록 (ky 활용)
export const createVendor = async (data) => {
  // json 옵션을 쓰면 Content-Type 설정과 JSON.stringify를 자동으로 해줍니다.
  return await api.post('api/vendors', { json: data }).json();
};