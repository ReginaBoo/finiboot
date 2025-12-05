import type { PortfolioItem } from "../../types/portfolio";

interface PortfolioBondRowProps {
  bond: PortfolioItem;
}

export function PortfolioBondRow({ bond }: PortfolioBondRowProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-[#482A69]">
            {bond.name}
          </h3>
          <p className="text-sm text-gray-600">ISIN: {bond.isin}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Количество:</span>
          <p className="font-medium">{bond.quantity} шт.</p>
        </div>
        <div>
          <span className="text-gray-500">Номинал:</span>
          <p className="font-medium">{bond.nominal} {bond.currency}</p>
        </div>
        <div>
          <span className="text-gray-500">Дата покупки:</span>
          <p className="font-medium">
            {bond.purchase_date === "0001-01-01"
              ? "Не указана"
              : new Date(bond.purchase_date).toLocaleDateString('ru-RU')
            }
          </p>
        </div>
        <div>
          <span className="text-gray-500">Дата продажи:</span>
          <p className="font-medium">
            {new Date(bond.sell_date).toLocaleDateString('ru-RU')}
          </p>
        </div>
      </div>
    </div>
  );
}