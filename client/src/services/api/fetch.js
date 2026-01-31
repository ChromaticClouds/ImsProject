import { api } from "@/services/api.js";

export const fetchApiHealth = () => api.get('api/health').json();