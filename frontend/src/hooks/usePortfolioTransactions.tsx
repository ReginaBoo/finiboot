import { useState, useEffect } from 'react';
import { portfolioService } from '../api/portfolioService';
import toast from 'react-hot-toast';
import type { PortfolioTransactions } from "../types/portfolio";

export const usePortfolioTransactions = (portfolioId?: number) => {
  const [transactions, setTransactions] = useState<PortfolioTransactions[]>([]);

  const fetchTransactions = async () => {
    if (!portfolioId) {
      setTransactions([]);
      return;
    }

    try {
      const data = await portfolioService.getTransactions(portfolioId);
      setTransactions([...data]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка загрузки портфелей';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [portfolioId]);

  return {
    transactions,
  };
};