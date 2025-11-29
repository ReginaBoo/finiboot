// hooks/usePortfolioBonds.ts
import { useState, useEffect } from 'react';
import { portfolioService } from '../api/portfolioService';
import type { PortfolioItem } from '../types/portfolio';


export function usePortfolioBonds(portfolioId: number | undefined) {
  const [bonds, setBonds] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBonds = async () => {
    if (!portfolioId) {
      setBonds([]);
      setError("ID портфеля не указан");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await portfolioService.getPortfolioBonds(portfolioId);
      setBonds(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки облигаций');

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
    error,
    refetch: fetchBonds
  };
}