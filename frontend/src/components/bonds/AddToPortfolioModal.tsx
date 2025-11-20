// components/bonds/AddToPortfolioModal.tsx
import { useState } from "react";
import type { Bond } from "../../types/bond";
import { usePortfolios } from "../../hooks/usePortfolios"

interface AddToPortfolioModalProps {
  bond: Bond | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bondISIN: string, quantity: number, purchaseDate: string, portfolioId: number, sellDate: string) => void;
}

export function AddToPortfolioModal({ bond, isOpen, onClose, onAdd }: AddToPortfolioModalProps) {
  const [quantity, setQuantity] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [sellDate, setSellDate] = useState("");

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | "">("");
  const { portfolios, isLoading, error } = usePortfolios();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bond && quantity && purchaseDate && selectedPortfolioId) {
      const quantityNum = parseInt(quantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        alert("Введите корректное количество");
        return;
      }

      onAdd(
        bond.isin,
        quantityNum,
        purchaseDate,
        selectedPortfolioId,
        sellDate
      );
      onClose();
      // Сброс формы
      setQuantity("");
      setPurchaseDate("");
      setSellDate("");
      setSelectedPortfolioId("");
    }
  };

  if (!isOpen || !bond) return null;

  return (
    <>
      {/* Затемненный фон на весь экран */}
      <div
        className="fixed inset-0 bg-black/40  z-40"
        onClick={onClose}
      />

      {/* Модальное окно по центру */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="text-center p-6   text-[#482A69]">
            <p className="text-xl font-semibold">
              Добавить в портфель
            </p>
            <p className="font-bold text-lg mt-2">
              {bond.name}
            </p>
          </div>
          {/* Форма */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Портфель
              </label>
              {isLoading ? (
                <div className="text-sm text-gray-500">Загрузка портфелей...</div>
              ) : error ? (
                <div className="text-sm text-red-500">{error}</div>
              ) : portfolios.length === 0 ? (
                <div className="text-sm text-gray-500">
                  У вас нет портфелей. Создайте портфель сначала.
                </div>
              ) : (
                <select
                  value={selectedPortfolioId}
                  onChange={(e) => setSelectedPortfolioId(e.target.value ? parseInt(e.target.value) : "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#482A69] focus:border-transparent"
                  required
                >
                  <option value="">Выберите портфель</option>
                  {portfolios.map((portfolio) => (
                    <option key={portfolio.id} value={portfolio.id}>
                      {portfolio.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#482A69] focus:border-transparent"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата покупки
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#482A69] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата продажи
              </label>
              <input
                type="date"
                value={sellDate}
                onChange={(e) => setSellDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#482A69] focus:border-transparent"
                required
              />
            </div>


            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white bg-[#482A69] rounded-md hover:bg-[#3A2155] transition-colors"
              >
                Добавить
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}