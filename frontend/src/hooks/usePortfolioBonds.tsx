import { useState, useEffect } from 'react';
import { portfolioService } from '../api/portfolioService';
import type { PortfolioItem } from '../types/portfolio';
import { useNotificationContext } from '../components/context/NotificationContext';

export function usePortfolioBonds(portfolioId: number | undefined) {
  const [bonds, setBonds] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotificationContext();
  const fetchBonds = async () => {
    if (!portfolioId) {
      setBonds([]);
      showNotification("ID портфеля не указан", 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const data = await portfolioService.getPortfolioBonds(portfolioId);
      setBonds(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const error = (err.response?.data?.message || 'Ошибка загрузки облигаций');
      showNotification(error, 'error')
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
    refetch: fetchBonds
  };
}