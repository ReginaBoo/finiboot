import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from "../components/layout/AppLayout";
import { usePortfolioBonds } from "../hooks/usePortfolioBonds";
import { PortfolioBondRow } from "../components/portfolio/PortfolioBondRow";
import { PortfolioTransactionsList } from "../components/portfolio/PortfolioTransactionsList";

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const portfolioId = id ? parseInt(id) : undefined;
  const { bonds, isLoading } = usePortfolioBonds(portfolioId);
  const [activeTab, setActiveTab] = useState<'bonds' | 'transactions'>('bonds');

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8 text-[#482A69]">
          <div className="text-center">Загрузка портфеля...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 text-[#482A69] flex flex-col h-[calc(100vh)]">
        <div className="flex-shrink-0 mt-3 mb-4">
          <Link
            to="/portfolio"
            className="text-[#482A69] hover:text-[#3A2155] transition-colors inline-flex items-center"
          >
            ← Назад к портфелям
          </Link>
        </div>

        <div className="flex-shrink-0 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('bonds')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'bonds'
                  ? 'border-[#482A69] text-[#482A69]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Облигации ({bonds.length})
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'transactions'
                  ? 'border-[#482A69] text-[#482A69]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                История
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1 py-3">
          {activeTab === 'bonds' ? (
            !bonds || bonds.length === 0 ? (
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
            )
          ) : (
            <PortfolioTransactionsList portfolioId={portfolioId} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}