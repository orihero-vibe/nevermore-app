import { useEffect, useState, useRef } from 'react';

interface UseSettingsContentOptions {
  fetcher: () => Promise<string | null>;
  notFoundMessage: string;
  errorMessage: string;
}

export const useSettingsContent = ({
  fetcher,
  notFoundMessage,
  errorMessage,
}: UseSettingsContentOptions) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedContent = await fetcherRef.current();
        
        if (fetchedContent) {
          setContent(fetchedContent);
        } else {
          setError(notFoundMessage);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : errorMessage;
        setError(errorMsg);
        console.error('Error fetching settings content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading, error };
};

