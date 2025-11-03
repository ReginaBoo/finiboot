import { useState, useEffect } from 'react';
import { bondsService } from '../services/bondsService';
import type { Bond } from '../types/bond';

export function useSearchBonds() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Bond[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const data = await bondsService.searchBonds(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return { query, setQuery, results, isLoading };

}