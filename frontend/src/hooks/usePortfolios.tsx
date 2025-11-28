// hooks/usePortfolios.ts
import { useState, useEffect } from 'react';
import { portfolioService } from '../api/portfolioService';
import type { Portfolio } from '../types/portfolio';

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await portfolioService.getUserPortfolios();
      setPortfolios(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка загрузки портфелей';
      setError(errorMessage);
      console.error('Error fetching portfolios:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createPortfolio = async (name: string) => {
    try {
      setError(null);
      const newPortfolio = await portfolioService.createPortfolio(name);

      // ОБНОВЛЯЕМ список портфелей после создания
      await fetchPortfolios(); // ← ВАЖНО: обновляем данные

      return newPortfolio;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка создания портфеля';
      setError(errorMessage);
      console.error('Error creating portfolio:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  return {
    portfolios,
    isLoading,
    error,
    createPortfolio,
    refetch: fetchPortfolios
  };
}