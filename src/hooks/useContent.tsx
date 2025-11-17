import { useState, useEffect, useCallback } from 'react';
import { contentService, Content } from '../services/content.service';

interface UseContentReturn {
  content: Content[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all content from Appwrite
 */
export function useContent(): UseContentReturn {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedContent = await contentService.getContent();
      setContent(fetchedContent);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content';
      setError(errorMessage);
      console.error('Error in useContent hook:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
}

/**
 * Hook to fetch content by category ID
 */
export function useContentByCategory(categoryId: string | null): UseContentReturn {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    if (!categoryId) {
      setContent([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedContent = await contentService.getContentByCategory(categoryId);
      setContent(fetchedContent);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content';
      setError(errorMessage);
      console.error('Error in useContentByCategory hook:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
}

interface UseContentDetailsReturn {
  content: Content | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch a single content item by ID
 */
export function useContentDetails(contentId: string): UseContentDetailsReturn {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    if (!contentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedContent = await contentService.getContentById(contentId);
      setContent(fetchedContent);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content details';
      setError(errorMessage);
      console.error('Error in useContentDetails hook:', err);
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
}

/**
 * Hook to fetch content by category ID and role
 */
export function useContentByCategoryAndRole(categoryId: string | null, role: string | null): UseContentReturn {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    if (!categoryId || !role) {
      setContent([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedContent = await contentService.getContentByCategoryAndRole(categoryId, role);
      setContent(fetchedContent);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content';
      setError(errorMessage);
      console.error('Error in useContentByCategoryAndRole hook:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryId, role]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
}

