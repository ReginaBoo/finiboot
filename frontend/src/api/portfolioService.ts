import api from "./api";
import type { Portfolio, PortfolioItem, PortfolioTransactions } from "../types/portfolio";

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

  async createPortfolio(name: string): Promise<Portfolio> {
    const response = await api.post(`${API_BASE_URL}/create`, {
      name: name
    });
    return response.data;
  },

  async getPortfolioBonds(portfolioId: number): Promise<PortfolioItem[]> {
    const response = await api.get(`${API_BASE_URL}/bonds?id=${portfolioId}`);
    return response.data;
  },

  async deletePortfolio(portfolioId: number): Promise<void> {
    const response = await api.delete(`${API_BASE_URL}/delete/${portfolioId}`);
    return response.data
  },

  async getTransactions(portfolioId: number): Promise<PortfolioTransactions[]> {
    const response = await api.get(`${API_BASE_URL}/transactions?id=${portfolioId}`);
    return response.data
  },

  async getCouponAnalytics(portfolioId: number): Promise<{ month: string; amount: number }[]> {
    const response = await api.get(`${API_BASE_URL}/analytics/coupons?id=${portfolioId}`);
    return response.data;
  },
};