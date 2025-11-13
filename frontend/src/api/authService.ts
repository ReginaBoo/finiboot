import api from "./api";
import type { RegisterData, LoginData } from '../types/auth';

const API_BASE_URL = '/auth';

export const authService = {
  login: (data: LoginData) => api.post(`${API_BASE_URL}/login`, data).then(res => res.data),
  register: (data: RegisterData) => api.post(`${API_BASE_URL}/register`, data).then(res => res.data),
};

