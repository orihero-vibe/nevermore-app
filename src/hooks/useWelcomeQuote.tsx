import { useState, useEffect } from 'react';
import { quoteService, WelcomeQuote } from '../services/quote.service';

export const useWelcomeQuote = () => {
  const [quote, setQuote] = useState<WelcomeQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuote();
  }, []);

  const loadQuote = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedQuote = await quoteService.getRandomQuote();
      setQuote(fetchedQuote);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quote';
      setError(errorMessage);
      console.error('Error loading welcome quote:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshQuote = () => {
    loadQuote();
  };

  return {
    quote,
    loading,
    error,
    refreshQuote,
  };
};

