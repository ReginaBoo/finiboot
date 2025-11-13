import { useState, useEffect } from 'react';
import { bondsService } from '../api/bondsService';
import type { Bond } from '../types/bond';

interface UseBondsProps {
  initialPage?: number;
  pageSize?: number;
}

export const useBonds = ({
  initialPage = 0,
  pageSize = 7
}: UseBondsProps = {}) => {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedBonds, setCachedBonds] = useState<Bond[]>([]);


  useEffect(() => {
    let isCancelled = false;

    const fetchBonds = async () => {
      setIsLoading(true);
      setError(null);

      if (isCancelled) return;
      try {
        const response = await bondsService.getBonds(currentPage, pageSize);

        setCachedBonds(response.content);
        setBonds(response.content);
        setTotalPages(response.total_pages);
      } catch (err: any) {

        if (isCancelled) return;

        if (err.response?.status === 401) {
          setError('Пожалуйста, войдите в систему');
        } else {
          setError('Ошибка загрузки облигаций');
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (bonds.length > 0) {
      setCachedBonds(bonds);
    }

    fetchBonds();
    return () => {
      isCancelled = true;
    };
  }, [currentPage, pageSize]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const displayedBonds = isLoading && cachedBonds.length > 0 ? cachedBonds : bonds;

  return {
    bonds: displayedBonds,
    currentPage,
    totalPages,
    isLoading,
    error,
    handlePreviousPage,
    handleNextPage,
    setCurrentPage
  };
};