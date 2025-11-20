import { useDelayedLoading } from '../../hooks/useDelayedLoading';
interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ query, setQuery, isLoading = false }: SearchBarProps) => {

  const showLoading = useDelayedLoading(isLoading, 300, 200);
  return (
    <div className="relative w-full max-w-lg">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Название, тикер или ISIN..."
        className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:[#482A69]"
      />
      {showLoading && (
        <div className="absolute right-4 top-2.5 text-gray-400 text-sm">
          Загрузка...
        </div>
      )}
    </div>
  );
};