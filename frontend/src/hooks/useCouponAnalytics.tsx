import { useState, useEffect } from 'react';
import { portfolioService } from '../api/portfolioService';

export function useCouponAnalytics(portfolioId?: number) {
  const [data, setData] = useState<{ month: string; amount: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!portfolioId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await portfolioService.getCouponAnalytics(portfolioId);
        setData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Failed to fetch coupon analytics:", err);
        setError("Ошибка при загрузке аналитики");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [portfolioId]);

  return { data, isLoading, error };
}