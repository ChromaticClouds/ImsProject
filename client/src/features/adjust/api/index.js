import { api, hooks } from '@/services/api.js';

export const adjustProducts = (form) =>
  api.post('adjust', { json: form, hooks }).json();
