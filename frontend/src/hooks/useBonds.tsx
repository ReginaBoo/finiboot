import { useState, useEffect } from 'react';
import { bondsService } from '../api/bondsService';
import type { Bond } from '../types/bond';
import toast from 'react-hot-toast';
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
  const [previousBonds, setPreviousBonds] = useState<Bond[]>([]);

  useEffect(() => {
    const fetchBonds = async () => {
      setIsLoading(true);
      setError(null);

      try {

        setPreviousBonds(bonds);

        const response = await bondsService.getBonds(currentPage, pageSize);

        setBonds(response.content);
        setTotalPages(response.total_pages);
      } catch (err: any) {
        const errorMessage = err.message || 'Ошибка при загрузке облигаций';
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBonds();
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

  const displayedBonds = isLoading && previousBonds.length > 0 ? previousBonds : bonds;

  return {
    bonds: displayedBonds,
    currentPage,
    totalPages,
    isLoading,
    error,
    handlePreviousPage,
    handleNextPage,
  };
};