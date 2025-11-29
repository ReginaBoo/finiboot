import { useParams, Link } from 'react-router-dom';
import { AppLayout } from "../components/layout/AppLayout";
import { usePortfolioBonds } from "../hooks/usePortfolioBonds";
import { PortfolioBondRow } from "../components/portfolio/PortfolioBondRow";

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const portfolioId = id ? parseInt(id) : undefined;
  const { bonds, isLoading } = usePortfolioBonds(portfolioId);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8 text-[#482A69]">
          <div className="text-center">Загрузка облигаций портфеля...</div>
        </div>
      </AppLayout>
    );
  }


  return (
    <AppLayout>
      <div className="p-4 text-[#482A69] flex flex-col h-[calc(100vh)]">
        <div className="flex-shrink-0 mb-4">
          <Link
            to="/portfolio"
            className="text-[#482A69] hover:text-[#3A2155] transition-colors inline-flex items-center"
          >
            ← Назад к портфелям
          </Link>
        </div>

        <div className="flex-shrink-0 mb-6">
          <h1 className="text-2xl font-bold">Портфель #{portfolioId}</h1>
          <p className="text-gray-600 mt-1">
            Облигаций в портфеле: {bonds.length}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-1 py-3">
          {!bonds || bonds.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-4">В портфеле пока нет облигаций</p>
              <Link
                to="/bonds"
                className="px-6 py-2 bg-[#482A69] text-white rounded-md hover:bg-[#3A2155] transition-colors"
              >
                Добавить облигации
              </Link>
            </div>
          ) : (
            bonds.map((bond, index) => (
              <div key={`${bond.isin}-${index}`} className="mb-3">
                <PortfolioBondRow bond={bond} />
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}