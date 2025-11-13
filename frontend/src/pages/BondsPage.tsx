import { AppLayout } from "../components/layout/AppLayout";
import { useBonds } from "../hooks/useBonds";
import { useSearchBonds } from "../hooks/useSearchBonds";
import { BondsTableHeader } from "../components/bonds/BondsTableHeader";
import { BondRow } from "../components/bonds/BondRow";
import { SearchBar } from "../components/bonds/SearchBar";
import { Pagination } from "../components/bonds/Pagination";
import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

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
    <AppLayout>
      <div className="p-8 text-[#482A69] flex flex-col h-[calc(100vh)]">
        {/* Поиск */}
        <div className="flex-shrink-0 mb-3">
          <SearchBar query={query} setQuery={setQuery} isLoading={isSearchLoading} />
        </div>
        {/* Таблица облигаций */}
        <div className="flex-shrink-0 px-5">
          <BondsTableHeader />
        </div>

        {/* Список облигаций */}
        <div ref={scrollRef} className=" flex-1 overflow-y-auto px-5 py-3 divide-y divide-gray-100">
          {displayedBonds.map((bond) => (
            <BondRow key={bond.bond_id} bond={bond} />
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
  );
}