import { usePortfolioTransactions } from '../../hooks/usePortfolioTransactions';

interface TransactionsListProps {
  portfolioId?: number;
}

export function PortfolioTransactionsList({ portfolioId }: TransactionsListProps) {
  const { transactions } = usePortfolioTransactions(portfolioId);


  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime();
  });

  return (
    <div className="space-y-2">
      {sortedTransactions.map((transaction) => {
        return (
          <div
            key={transaction.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-md text-[#482A69]">
                  {transaction.bond_isin}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-md font-bold text-[#482A69]">
                  {transaction.quantity} шт.
                </div>
                <div className="text-xs text-gray-500">
                  {(Number(transaction.price) * transaction.quantity).toFixed(2)} ₽
                </div>
              </div>
            </div>


            <div className="flex justify-between">
              <span className="text-[14px] text-gray-600">Дата покупки:</span>
              <span className="text-[14px]">
                {new Date(transaction.purchase_date).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[14px] text-gray-600">Дата продажи:</span>
              <span className="text-[14px] text-[#482A69]">
                {new Date(transaction.sell_date).toLocaleDateString('ru-RU')}
              </span>
            </div>

          </div>
        );
      })}
    </div >
  );
}