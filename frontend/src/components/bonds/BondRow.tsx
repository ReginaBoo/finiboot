import type { Bond } from '../../types/bond';

interface BondRowProps {
  bond: Bond;
}

export const BondRow = ({ bond }: BondRowProps) => {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
      {/* Название и тикер */}
      <div className="col-span-2">
        <p className="font-medium text-gray-900">{bond.name}</p>
        <p className="text-sm text-gray-500 mt-1">{bond.ticker}</p>
      </div>

      {/* Номинал */}
      <div className="col-span-2 text-right">
        <p className="font-medium text-gray-900">
          {bond.nominal.toLocaleString('ru-RU')} ₽
        </p>
      </div>

      {/* Сектор */}
      <div className="col-span-2 text-right">
        <p className="font-medium text-gray-900">
          {bond.sector}
        </p>
      </div>

      {/* Купон */}
      <div className="col-span-2 text-right">
        <p className="font-medium text-gray-900">
          {bond.coupon_quantity_per_year}
        </p>

      </div>

      {/* Дата выпуска */}
      <div className="col-span-2 text-right">
        <p className="text-gray-600">
          {new Date(bond.placement_date).toLocaleDateString('ru-RU')}
        </p>
      </div>

      {/* Дата погашения */}
      <div className="col-span-2 text-right">
        <p className="text-gray-600">
          {bond.perpertual_flag
            ? "-"
            : bond.maturity_date
              ? new Date(bond.maturity_date).toLocaleDateString('ru-RU')
              : "-"}
        </p>
      </div>
    </div>
  );
};