import type { PortfolioItem } from "../../types/portfolio";
import "../../assets/PortfolioBondRow.scss";
interface PortfolioBondRowProps {
  bond: PortfolioItem;
}

export function PortfolioBondRow({ bond }: PortfolioBondRowProps) {
  return (
    <div className="portfolio-bond-row">
      <div className="header">
        <div>
          <h3>{bond.name}</h3>
          <p>ISIN: {bond.isin}</p>
        </div>
      </div>

      <div className="details">
        <div className="detail-item">
          <span>Количество:</span>
          <p>{bond.quantity} шт.</p>
        </div>
        <div className="detail-item">
          <span>Номинал:</span>
          <p>{bond.nominal} {bond.currency}</p>
        </div>
        <div className="detail-item">
          <span>Дата покупки:</span>
          <p>
            {bond.purchase_date === "0001-01-01"
              ? "Не указана"
              : new Date(bond.purchase_date).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <div className="detail-item">
          <span>Дата продажи:</span>
          <p>{new Date(bond.sell_date).toLocaleDateString('ru-RU')}</p>
        </div>
      </div>
    </div>
  );
}