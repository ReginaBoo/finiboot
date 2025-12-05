import { useState, useEffect } from 'react';
import { portfolioService } from '../api/portfolioService';
import type { PortfolioItem } from '../types/portfolio';
import toast from 'react-hot-toast';
export function usePortfolioBonds(portfolioId: number | undefined) {
  const [bonds, setBonds] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBonds = async () => {
    if (!portfolioId) {
      setBonds([]);
      toast.error("ID портфеля не указан");
      return;
    }
    setIsLoading(true);
    try {
      const data = await portfolioService.getPortfolioBonds(portfolioId);
      setBonds(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const error = (err.response?.data?.message || 'Ошибка загрузки облигаций');
      toast.error(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBonds();
  }, [portfolioId]);

  return {
    bonds,
    isLoading,
  };
}