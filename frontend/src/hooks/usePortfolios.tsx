import { useState, useEffect } from 'react';
import { portfolioService } from '../api/portfolioService';
import type { Portfolio } from '../types/portfolio';
import toast from 'react-hot-toast';

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await portfolioService.getUserPortfolios();
      setPortfolios([...data]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка загрузки портфелей';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const createPortfolio = async (name: string) => {
    try {
      setError(null);
      const newPortfolio = await portfolioService.createPortfolio(name);
      toast.success('Портфель успешно создан');
      await fetchPortfolios();
      return newPortfolio;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка создания портфеля';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const deletePortfolio = async (portfolioId: number) => {
    try {
      setError(null);
      await portfolioService.deletePortfolio(portfolioId);
      await fetchPortfolios();
      toast.success('Портфель успешно удален');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка удаления портфеля';
      setError(errorMessage);
      toast.error(errorMessage);
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

      toast.success("Облигация успешно добавлена в портфель!");
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка при загрузке облигаций';
      toast.error(errorMessage);
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