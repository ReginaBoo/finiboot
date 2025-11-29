import { useState } from 'react';

interface CreatePortfolioFormProps {
  onPortfolioCreated?: (portfolioId: number) => void;
  compact?: boolean;
  autoClose?: boolean;
  placeholder?: string;
  onCreatePortfolio: (name: string) => Promise<any>;
}

export function CreatePortfolioForm({
  onPortfolioCreated,
  compact = false,
  autoClose = true,
  placeholder = "Название портфеля",
  onCreatePortfolio
}: CreatePortfolioFormProps) {

  const [portfolioName, setPortfolioName] = useState('');
  const [showForm, setShowForm] = useState(!compact);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const newPortfolio = await onCreatePortfolio(portfolioName);

      if (newPortfolio) {
        setPortfolioName('');

        if (autoClose && compact) {
          setShowForm(false);
        }

        if (onPortfolioCreated) {
          onPortfolioCreated(newPortfolio.id);
        }
      }
    } catch (error) {

    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setPortfolioName('');
  };

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
                placeholder={placeholder}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#482A69] focus:border-transparent text-sm"
                maxLength={50}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!portfolioName.trim()}
                className="px-3 py-2 bg-[#482A69] text-white rounded-md hover:bg-[#3A2155] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                ✓
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={portfolioName}
          onChange={(e) => setPortfolioName(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#482A69] focus:border-transparent"
          maxLength={50}
        />
        <button
          type="submit"
          disabled={!portfolioName.trim()}
          className="px-4 py-2 bg-[#482A69] text-white rounded-md hover:bg-[#3A2155] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Создать портфель
        </button>
      </div>
    </form>
  );
}