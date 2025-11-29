// pages/PortfolioPage.tsx
import { AppLayout } from "../components/layout/AppLayout";
import { usePortfolioManagement } from "../hooks/usePortfolioManagement";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreatePortfolioForm } from "../components/portfolio/CreatePortfolioForm";
import { useDelayedLoading } from '../hooks/useDelayedLoading';
export default function PortfolioPage() {
  const {
    portfolios,
    isLoading,
    deletePortfolio,
    refetch
  } = usePortfolioManagement();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const showLoading = useDelayedLoading(isLoading, 500, 300);

  const handlePortfolioCreated = () => {
    refetch();
  };


  const handleDeletePortfolio = async (portfolioId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот портфель?")) {
      return;
    }

    setDeletingId(portfolioId);
    try {
      await deletePortfolio(portfolioId);
    } catch (error: any) {
    } finally {
      setDeletingId(null);
    }
  };

  if (showLoading) {
    return (
      <AppLayout>
        <div className="p-8 text-[#482A69]">
          <div className="text-center">Загрузка портфелей...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <AppLayout>
        <div className="p-8 text-[#482A69]">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-6">Мои портфели</h1>
            <span className="max-w-md">
              <CreatePortfolioForm
                onPortfolioCreated={handlePortfolioCreated}
                compact={false}
              />
            </span>
          </div>
          {portfolios.length == 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">У вас пока нет портфелей</p>
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
                    <button
                      onClick={() => handleDeletePortfolio(portfolio.id)}
                      disabled={deletingId === portfolio.id}
                      className="px-4 py-2 border-2 border-[#3A2155] text-[#3A2155] rounded-md transition-colors text-sm flex-1"
                    >
                      {deletingId === portfolio.id ? "Удаление..." : "Удалить"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppLayout >

    </>
  );
}