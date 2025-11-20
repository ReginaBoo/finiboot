// hooks/usePortfolios.ts
import { useState, useEffect } from 'react';
import { portfolioService } from '../api/portfolioService';
import type { Portfolio } from "../types/portfolio";


export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await portfolioService.getUserPortfolios();
        setPortfolios(data);
      } catch (err) {
        setError('Ошибка при загрузке портфелей');
        console.error('Error fetching portfolios:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  return { portfolios, isLoading, error };
}