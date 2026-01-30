import { api } from "@/services/api.js";

export const fetchApiHealth = () => api.get('api/health').json();

import API_BASE_URL from '../api';

export async function fetchVendors(params = '') {
  const res = await fetch(`${API_BASE_URL}/vendors${params}`);
  if (!res.ok) throw new Error('거래처 목록 조회 실패');
  return res.json();
}

export async function createVendor(data) {
  const res = await fetch(`${API_BASE_URL}/vendors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('거래처 등록 실패');
  return res.json();
}
