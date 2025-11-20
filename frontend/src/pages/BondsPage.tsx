import { AppLayout } from "../components/layout/AppLayout";
import { useBonds } from "../hooks/useBonds";
import { useSearchBonds } from "../hooks/useSearchBonds";
import { BondsTableHeader } from "../components/bonds/BondsTableHeader";
import { AddToPortfolioModal } from "../components/bonds/AddToPortfolioModal";
import { BondRow } from "../components/bonds/BondRow";
import { SearchBar } from "../components/bonds/SearchBar";
import { Pagination } from "../components/bonds/Pagination";
import { useEffect, useRef, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { usePortfolioOperations } from "../hooks/usePortfolioOperations";
import type { Bond } from "../types/bond";



export default function BondsPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    bonds,
    currentPage,
    totalPages,
    isLoading,
    error,
    handlePreviousPage,
    handleNextPage
  } = useBonds({ pageSize: 10 });

  const { query, setQuery, results, isLoading: isSearchLoading } = useSearchBonds();
  const displayedBonds = query.trim() ? results : bonds;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const { handleAddToPortfolio } = usePortfolioOperations();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const handleAddClick = (bond: Bond) => {
    setSelectedBond(bond);
    setIsModalOpen(true);
  };

  if (error) {
    return (
      <AppLayout>
        <div className="p-8 text-[#482A69]">
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <AppLayout>
        <div className="p-4 text-[#482A69] flex flex-col h-[calc(100vh)]">
          {/* Поиск */}
          <div className="flex-shrink-0 mx-10">
            <SearchBar query={query} setQuery={setQuery} isLoading={isSearchLoading} />
          </div>
          {/* Таблица облигаций */}
          <div className="flex-shrink-0">
            <BondsTableHeader />
          </div>


          {/* Список облигаций */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-1 py-3">
            {displayedBonds.map((bond) => (
              <div key={bond.bond_id} className="flex items-start mb-2 group">
                {/* Кнопка добавления */}
                <div className="flex-shrink-0 w-10 h-full flex items-center justify-center mt-4 ">
                  <button
                    onClick={() => handleAddClick(bond)}
                    className=" justify-center hover:text-[#3A2155] hover:cursor-pointer transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <IoAddCircleOutline size={25} />
                  </button>
                </div>

                {/* Карточка облигации */}
                <div className="flex-1">
                  <BondRow bond={bond} />
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {!query.trim() && (
            <div className="flex-shrink-0 mt-3"><Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              isLoading={isLoading}

            /></div>)}

        </div>
      </AppLayout>
      <div>
        <AddToPortfolioModal
          bond={selectedBond}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBond(null);
          }}
          onAdd={handleAddToPortfolio}
        />
      </div>
    </>
  );
}