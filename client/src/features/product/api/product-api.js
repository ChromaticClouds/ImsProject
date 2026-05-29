import { api } from '@/services/api';

export const fetchProducts = async () => api.get('product').json();
