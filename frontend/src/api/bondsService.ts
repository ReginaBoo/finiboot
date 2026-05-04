import type { Bond, BondsResponse } from '../types/bond';
import api from "./api";
const API_BASE_URL = '/bonds';

export const bondsService = {
  async getBonds(page: number = 0, size: number = 7): Promise<BondsResponse> {
    const response = await api.get<BondsResponse>(`${API_BASE_URL}/`, {
      params: { page, size }
    });
    return response.data;
  },

  async searchBonds(q: string): Promise<Bond[]> {
    const response = await api.get<Bond[]>(`${API_BASE_URL}/search`, {
      params: { q }
    });
    return response.data;
  }
};

