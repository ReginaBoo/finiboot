import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from "react";
import type { Bond } from "../../types/bond";
import { CreatePortfolioForm } from "./CreatePortfolioForm";
import { usePortfolios } from '../../hooks/usePortfolios';
import { useNotificationContext } from '../context/NotificationContext';

interface AddToPortfolioModalProps {
  bond: Bond | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToPortfolioModal({ bond,
  isOpen,
  onClose,
}: AddToPortfolioModalProps) {
  const [quantity, setQuantity] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [sellDate, setSellDate] = useState("");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | "">("");
  const { addBondToPortfolio, createPortfolio, portfolios } = usePortfolios();
  const { showNotification } = useNotificationContext();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bond || !quantity || !purchaseDate || !selectedPortfolioId) {
      return;
    }
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return;
    }
    try {
      const success = await addBondToPortfolio(
        bond.isin,
        quantityNum,
        purchaseDate,
        selectedPortfolioId,
        sellDate
      );
      if (success) {
        onClose();
        resetForm();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка';
      showNotification(errorMessage, 'error');
    }
  };

  const resetForm = () => {
    setQuantity("");
    setPurchaseDate("");
    setSellDate("");
    setSelectedPortfolioId("");
  };

  if (!bond) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="text-center pt-6 pb-4 px-6 text-[#482A69]">
            <DialogTitle className="text-md font-semibold">
              Добавить в портфель:
            </DialogTitle>
            <DialogTitle className="font-bold text-lg">
              {bond.name}
            </DialogTitle>
          </div>

          <form onSubmit={handleSubmit} className="py-2 px-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Портфель
              </label>
              {portfolios.length === 0 ? (
                <CreatePortfolioForm
                  onCreatePortfolio={createPortfolio}
                  compact={true}
                />
              ) : (
                <div className="space-y-3">
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

                  <CreatePortfolioForm
                    onCreatePortfolio={createPortfolio}
                    compact={true}
                  />
                </div>
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
        </DialogPanel>
      </div>
    </Dialog>
  );
}