import { AppLayout } from "../components/layout/AppLayout";
import { useBonds } from "../hooks/useBonds";
import { useSearchBonds } from "../hooks/useSearchBonds";
import { BondsTableHeader } from "../components/bonds/BondsTableHeader";
import { BondRow } from "../components/bonds/BondRow";
import { SearchBar } from "../components/bonds/SearchBar";
import { Pagination } from "../components/bonds/Pagination";

export default function BondsPage() {

  const {
    bonds,
    currentPage,
    totalPages,
    isLoading,
    error,
    handlePreviousPage,
    handleNextPage
  } = useBonds({ pageSize: 7 });

  const { query, setQuery, results, isLoading: isSearchLoading } = useSearchBonds();
  const displayedBonds = query.trim() ? results : bonds;

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
      <div className="p-8 text-[#482A69]">
        {/* Поиск */}
        <SearchBar query={query} setQuery={setQuery} isLoading={isSearchLoading} />

        {/* Таблица облигаций */}
        <div className="">
          <BondsTableHeader />

          {/* Список облигаций */}
          <div className="divide-y divide-gray-100">
            {displayedBonds.map((bond) => (
              <BondRow key={bond.bond_id} bond={bond} />
            ))}
          </div>
        </div>

        {/* Пагинация */}
        {!query.trim() && (<Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          isLoading={isLoading}
        />)}
      </div>
    </AppLayout>
  );
}