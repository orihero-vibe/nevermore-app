import { useState, useEffect, useCallback } from 'react';
import { categoryService, getCategoryName } from '../services/category.service';
import type { Category } from '../services/category.service';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getCategoryName: (category: Category) => string;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await categoryService.getCategories();
      setCategories(fetchedCategories);
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
      const errorMessage = err?.message || 'Failed to fetch categories';
      setError(errorMessage);
      // Set empty array on error
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    getCategoryName,
  };
}

