import { useState, useEffect } from 'react';
import { portfolioService } from '../api/portfolioService';
import type { Portfolio } from '../types/portfolio';
import { useNotificationContext } from '../components/context/NotificationContext';

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotificationContext();

  const fetchPortfolios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await portfolioService.getUserPortfolios();
      setPortfolios([...data]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка загрузки портфелей';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const createPortfolio = async (name: string) => {
    try {
      setError(null);
      const newPortfolio = await portfolioService.createPortfolio(name);
      showNotification('Портфель успешно создан', 'success');
      await fetchPortfolios();
      return newPortfolio;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка создания портфеля';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    }
  };

  const deletePortfolio = async (portfolioId: number) => {
    try {
      setError(null);
      await portfolioService.deletePortfolio(portfolioId);
      await fetchPortfolios();
      showNotification('Портфель успешно удален', 'success');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка удаления портфеля';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    }
  };

  const addBondToPortfolio = async (
    bondISIN: string,
    quantity: number,
    purchaseDate: string,
    portfolioId: number,
    sellDate: string,
  ) => {
    try {
      await portfolioService.addBondToPortfolio(
        portfolioId,
        bondISIN,
        quantity,
        purchaseDate,
        sellDate
      );

      showNotification("Облигация успешно добавлена в портфель!", 'success');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка при загрузке облигаций';
      showNotification(errorMessage, 'error');
      return false;
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
    deletePortfolio,
    addBondToPortfolio
  };
}