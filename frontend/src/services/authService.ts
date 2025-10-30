import axios from 'axios';
import type { RegisterData, AuthResponse, LoginData, LoginResponse } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080/auth';

export const authService = {
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/register`, userData, {
      timeout: 5000
    });
    return response.data;
  },

  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials, {
      timeout: 5000
    });
    return response.data;
  },
};