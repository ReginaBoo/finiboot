// hooks/usePortfolioOperations.ts
import { portfolioService } from '../api/portfolioService';

export function usePortfolioOperations() {
  const handleAddToPortfolio = async (
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
      alert("Облигация успешно добавлена в портфель!");
      return true;
    } catch (error: any) {
      console.error("Error adding to portfolio:", error);

      if (error.response?.status === 401) {
        alert("Ошибка авторизации. Пожалуйста, войдите снова.");
      } else {
        alert("Ошибка при добавлении в портфель");
      }
      return false;
    }
  };

  return {
    handleAddToPortfolio
  };
}