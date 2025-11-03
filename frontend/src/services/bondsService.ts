// services/bondsService.ts
import axios from 'axios';
import type { Bond, BondsResponse } from '../types/bond';

const API_BASE_URL = 'http://localhost:8080/bonds';

export const bondsService = {
  async getBonds(page: number = 0, size: number = 7): Promise<BondsResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/bonds`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        size
      }
    });
    return response.data;
  },

  async searchBonds(q: string): Promise<Bond[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { q }
    });
    return response.data;
  }
};

