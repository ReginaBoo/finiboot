// components/bonds/Pagination.tsx
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
  const isPreviousDisabled = currentPage === 0 || isLoading;
  const isNextDisabled = currentPage >= totalPages - 1 || isLoading;

  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        className={`px-4 py-2 rounded ${isPreviousDisabled
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-[#482A69] text-white hover:bg-[#3a2155]'
          }`}
      >
        {isLoading ? '?' : 'Назад'}
      </button>

      <span className="text-sm text-gray-600">
        {isLoading ? 'Загрузка...' : `Страница ${currentPage + 1} из ${totalPages}`}
      </span>

      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`px-4 py-2 rounded ${isNextDisabled
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-[#482A69] text-white hover:bg-[#3a2155]'
          }`}
      >
        {isLoading ? '?' : 'Вперед'}
      </button>
    </div>
  );
};