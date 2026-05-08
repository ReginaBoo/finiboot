import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from "../components/layout/AppLayout";
import { usePortfolioBonds } from "../hooks/usePortfolioBonds";
import { PortfolioBondRow } from "../components/portfolio/PortfolioBondRow";
import { PortfolioTransactionsList } from "../components/portfolio/PortfolioTransactionsList";
import { CouponChart } from "../components/portfolio/CouponChart";
import { useCouponAnalytics } from "../hooks/useCouponAnalytics";
import '../assets/PortfolioDetailPage.scss';

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const portfolioId = id ? parseInt(id) : undefined;
  const { bonds, isLoading } = usePortfolioBonds(portfolioId);
  const { data: couponData } = useCouponAnalytics(portfolioId);
  const [activeTab, setActiveTab] = useState<'bonds' | 'transactions'>('bonds');

  const [dummyFilters, setDummyFilters] = useState({
    sector: '',
    couponQuantity: 0,
    floatingCoupon: null,
    amortization: null
  });

  if (isLoading) return (
    <AppLayout filters={dummyFilters} onFilterChange={setDummyFilters}>
      <div className="portfolio-detail__loading">Загрузка портфеля...</div>
    </AppLayout>
  );

  return (
    <AppLayout filters={dummyFilters} onFilterChange={setDummyFilters}>
      <div className="portfolio-detail">
        <div className="portfolio-detail__header">
          <Link to="/portfolio" className="portfolio-detail__back">
            ← Назад к портфелям
          </Link>
        </div>

        <div className="portfolio-detail__tabs">
          <button
            className={`portfolio-detail__tab ${activeTab === 'bonds' ? 'active' : ''}`}
            onClick={() => setActiveTab('bonds')}
          >
            Облигации ({bonds.length})
          </button>
          <button
            className={`portfolio-detail__tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            История
          </button>
        </div>

        <div className="portfolio-detail__content">
          {activeTab === 'bonds' && (
            <>
              <CouponChart data={couponData} />
              <div className="portfolio-detail__bond-list">
                {bonds.length === 0 ? (
                  <div className="portfolio-detail__empty">
                    <p>В портфеле пока нет облигаций</p>
                    <Link to="/bonds" className="portfolio-detail__add-btn">
                      Добавить облигации
                    </Link>
                  </div>
                ) : (
                  bonds.map((bond, idx) => (
                    <PortfolioBondRow key={bond.isin + idx} bond={bond} />
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'transactions' && (
            <PortfolioTransactionsList portfolioId={portfolioId} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}