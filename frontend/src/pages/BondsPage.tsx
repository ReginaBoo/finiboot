import { AppLayout } from "../components/layout/AppLayout";
import { useBonds } from "../hooks/useBonds";
import { BondsTableHeader } from "../components/bonds/BondsTableHeader";
import { BondRow } from "../components/bonds/BondRow";
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
        <h1 className="text-2xl font-semibold mb-6">Список облигаций</h1>

        {/* Таблица облигаций */}
        <div className="bg-white rounded-lg shadow-sm">
          <BondsTableHeader />

          {/* Список облигаций */}
          <div className="divide-y divide-gray-100">
            {
              bonds.map(bond => (
                <BondRow key={bond.id} bond={bond} />
              ))
            }
          </div>
        </div>

        {/* Пагинация */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  );
}