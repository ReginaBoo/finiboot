// components/portfolio/CreatePortfolioForm.tsx
import { useState } from 'react';
import { usePortfolios } from '../../hooks/usePortfolios';

interface CreatePortfolioFormProps {
  onPortfolioCreated?: (portfolioId: number) => void;
  compact?: boolean;
  onPortfoliosUpdate?: () => void;
}

export function CreatePortfolioForm({ onPortfolioCreated, compact = false, onPortfoliosUpdate }: CreatePortfolioFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { createPortfolio } = usePortfolios();

  const handleCreatePortfolio = async () => {
    if (!portfolioName.trim()) {
      alert("Введите название портфеля");
      return;
    }

    try {
      setIsCreating(true);
      const newPortfolio = await createPortfolio(portfolioName.trim());

      setPortfolioName('');
      setShowForm(false);

      // Вызываем колбэк для обновления данных в родителе
      if (onPortfoliosUpdate) {
        onPortfoliosUpdate();
      }

      // Вызываем колбэк если передан
      if (onPortfolioCreated) {
        onPortfolioCreated(newPortfolio.id);
      }
    } catch (err) {
      console.error('Error creating portfolio:', err);
    } finally {
      setIsCreating(false);
    }
  };


  const handleCancel = () => {
    setShowForm(false);
    setPortfolioName('');
  };

  // Компактный вариант (только кнопка + форма)
  if (compact) {
    return (
      <div className="space-y-2">
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full py-2 text-[#482A69] border border-[#482A69] rounded-md hover:bg-[#482A69] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span>+</span>
            Создать новый портфель
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="Название портфеля"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#482A69] focus:border-transparent text-sm"
                maxLength={50}
              />
              <button
                type="button"
                onClick={handleCreatePortfolio}
                disabled={isCreating || !portfolioName.trim()}
                className="px-3 py-2 bg-[#482A69] text-white rounded-md hover:bg-[#3A2155] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isCreating ? '...' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm"
              >
                ×
              </button>
            </div>
            {portfolioName.trim() && (
              <div className="text-xs text-gray-500">
                Будет создан портфель: "{portfolioName}"
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Полный вариант (с заголовком и описанием)
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-500">
        У вас нет портфелей. Создайте портфель сначала.
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={portfolioName}
          onChange={(e) => setPortfolioName(e.target.value)}
          placeholder="Название портфеля"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#482A69] focus:border-transparent"
          maxLength={50}
        />
        <button
          type="button"
          onClick={handleCreatePortfolio}
          disabled={isCreating || !portfolioName.trim()}
          className="px-4 py-2 bg-[#482A69] text-white rounded-md hover:bg-[#3A2155] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? 'Создание...' : 'Создать'}
        </button>
      </div>

      {portfolioName.trim() && (
        <div className="text-xs text-gray-500">
          Будет создан портфель: "{portfolioName}"
        </div>
      )}
    </div>
  );
}