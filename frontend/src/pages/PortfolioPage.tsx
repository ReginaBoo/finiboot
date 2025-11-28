// pages/PortfolioPage.tsx
import { AppLayout } from "../components/layout/AppLayout";
import { usePortfolios } from "../hooks/usePortfolios";
import { Link } from "react-router-dom";


export default function PortfolioPage() {
  const { portfolios, isLoading, error, refetch } = usePortfolios();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8 text-[#482A69]">
          <div className="text-center">Загрузка портфелей...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-8 text-[#482A69]">
          <div className="text-red-600 text-center">{error}</div>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-[#482A69] text-white rounded-md hover:bg-[#3A2155]"
          >
            Попробовать снова
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8 text-[#482A69]">
        <h1 className="text-2xl font-bold mb-6">Мои портфели</h1>

        {portfolios.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">У вас пока нет портфелей</p>
            <Link
              to="/bonds"
              className="px-6 py-2 bg-[#482A69] text-white rounded-md hover:bg-[#3A2155] transition-colors"
            >
              Создать первый портфель
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{portfolio.name}</h3>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/portfolio/${portfolio.id}`}
                    className="px-4 py-2 bg-[#482A69] text-white rounded-md hover:bg-[#3A2155] transition-colors text-sm"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}