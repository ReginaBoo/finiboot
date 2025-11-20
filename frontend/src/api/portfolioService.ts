import api from "./api";
import type { Portfolio } from "../types/portfolio";

const API_BASE_URL = '/portfolio';

export const portfolioService = {
  async addBondToPortfolio(
    portfolioId: number,
    isin: string,
    quantity: number,
    purchaseDate: string,
    sellDate: string
  ) {

    const response = await api.post(`${API_BASE_URL}/bond/add`, {
      portfolio_id: portfolioId,
      isin: isin,
      quantity: quantity,
      purchase_date: purchaseDate,
      sell_date: sellDate,
    });


    return response.data;
  },

  async getUserPortfolios(): Promise<Portfolio[]> {
    const response = await api.get<Portfolio[]>(`${API_BASE_URL}/portfolios`);
    return response.data;
  },
};