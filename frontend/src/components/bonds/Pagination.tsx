import { useDelayedLoading } from '../../hooks/useDelayedLoading';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  isLoading = false
}: PaginationProps) => {

  const showLoading = useDelayedLoading(isLoading, 500, 300);

  const isPreviousDisabled = currentPage === 0 || showLoading;
  const isNextDisabled = currentPage >= totalPages - 1 || showLoading;

  const handlePrevious = () => {
    if (!isPreviousDisabled) {
      onPrevious();
    }
  };

  const handleNext = () => {
    if (!isNextDisabled) {
      onNext();
    }
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={handlePrevious}
        disabled={isPreviousDisabled}
        className={`px-4 py-2 rounded ${isPreviousDisabled
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-[#482A69] text-white cursor-pointer hover:bg-[#3a2155]'
          }`}
      >
        Назад
      </button>

      <span
        className={`text-sm transition-opacity duration-300 ${showLoading ? "text-gray-500 opacity-70" : "text-gray-700 opacity-100"
          }`}
      >
        {showLoading
          ? "Загрузка..."
          : `Страница ${currentPage + 1} из ${totalPages}`}
      </span>


      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`px-4 py-2 rounded ${isNextDisabled
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-[#482A69] text-white cursor-pointer hover:bg-[#3a2155]'
          }`}
      >
        Вперед
      </button>
    </div>
  );
};

Pagination.displayName = 'Pagination';