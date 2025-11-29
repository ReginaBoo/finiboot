// hooks/usePortfolioOperations.ts
import { portfolioService } from '../api/portfolioService';
import { useNotificationContext } from '../components/context/NotificationContext';

export function usePortfolioOperations() {
  const { showNotification } = useNotificationContext();

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

      showNotification("Облигация успешно добавлена в портфель!", 'success');
      return true;
    } catch (error: any) {
      console.error("Error adding to portfolio:", error);

      if (error.response?.status === 401) {
        showNotification("Ошибка авторизации. Пожалуйста, войдите снова.", 'error');
      } else {
        showNotification("Ошибка при добавлении в портфель", 'error');
      }
      return false;
    }
  };

  return {
    handleAddToPortfolio
  };
}