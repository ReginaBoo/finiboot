// hooks/usePortfolioManagement.ts
import { useState } from 'react';
import { useNotificationContext } from '../components/context/NotificationContext';
import { usePortfolios } from './usePortfolios';
import { usePortfolioOperations } from './usePortfolioOperations';

export function usePortfolioManagement() {
  const { showNotification } = useNotificationContext();
  const {
    portfolios,
    isLoading,
    error,
    createPortfolio: originalCreatePortfolio,
    deletePortfolio: originalDeletePortfolio,
    refetch
  } = usePortfolios();

  const { handleAddToPortfolio } = usePortfolioOperations();

  const [isCreating, setIsCreating] = useState(false);

  const createPortfolio = async (name: string) => {
    setIsCreating(true);
    try {
      const newPortfolio = await originalCreatePortfolio(name);
      showNotification("Портфель успешно создан", 'success');
      return newPortfolio;
    } catch (error: any) {
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const deletePortfolio = async (portfolioId: number) => {
    try {
      await originalDeletePortfolio(portfolioId);
      showNotification("Портфель успешно удален", 'success');
      return true;
    } catch (error: any) {
      throw error;
    }
  };


  const addBondToPortfolio = handleAddToPortfolio;

  return {

    portfolios,
    isLoading,
    error,

    isCreating,

    createPortfolio,
    deletePortfolio,
    addBondToPortfolio,
    refetch,

    // Утилиты
    showNotification
  };
}