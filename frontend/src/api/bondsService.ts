import type { Bond, BondsResponse } from '../types/bond';
import api from "./api";
const API_BASE_URL = '/bonds';

export const bondsService = {
  async getBonds(page: number = 0,
    size: number = 7,
    sector?: string,
    couponQuantity?: number,
    floatingCoupon?: boolean | null,
    amortization?: boolean | null): Promise<BondsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });

    if (sector) {
      params.append('sector', sector);
    }

    if (couponQuantity && couponQuantity > 0) {
      params.append('coupon_quantity', String(couponQuantity));
    }

    if (amortization !== null) {
      params.append('amortization', String(amortization));
    }

    if (floatingCoupon !== null) {
      params.append('floating_coupon', String(floatingCoupon));
    }


    const response = await api.get<BondsResponse>(`${API_BASE_URL}/`, {
      params: params
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

