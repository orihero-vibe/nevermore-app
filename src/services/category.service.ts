import { Query } from 'react-native-appwrite';
import { tablesDB } from './appwrite.config';
import { APPWRITE_DATABASE_ID, APPWRITE_CATEGORY_COLLECTION_ID } from '@env';

export interface Category {
  $id: string;
  name?: string;
  title?: string;
  label?: string;
  order?: number;
  $createdAt?: string;
  $updatedAt?: string;
  // Add other fields as needed based on your Appwrite schema
  [key: string]: unknown;
}

/**
 * Gets the display name from a category document
 * Tries name, title, label, or $id in that order
 */
export function getCategoryName(category: Category): string {
  return category.name || category.title || category.label || category.$id;
}

class CategoryService {
  private validateConfig(): void {
    if (!APPWRITE_DATABASE_ID) {
      const error = new Error(
        'APPWRITE_DATABASE_ID is not set in environment variables. Please add it to your .env file.'
      );
      console.error('Configuration Error:', error.message);
      throw error;
    }
    if (!APPWRITE_CATEGORY_COLLECTION_ID) {
      const error = new Error(
        'APPWRITE_CATEGORY_COLLECTION_ID is not set in environment variables. Please add it to your .env file.'
      );
      console.error('Configuration Error:', error.message);
      throw error;
    }
  }

  /**
   * Fetches all categories from Appwrite
   * @returns Promise<Category[]> Array of category documents
   */
  async getCategories(): Promise<Category[]> {
    this.validateConfig();

    console.log('Fetching categories from:', {
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: APPWRITE_CATEGORY_COLLECTION_ID,
    });

    try {
      // Fetch categories sorted by order field (ascending)
      let response;
      try {
        response = await tablesDB.listRows({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: APPWRITE_CATEGORY_COLLECTION_ID,
          queries: [
            Query.orderAsc('order'), // Sort by order field in ascending order
            Query.limit(100),
          ],
        });
      } catch (queryError) {
        // If query fails (e.g., order field doesn't exist or isn't indexed), fetch without ordering
        console.warn('Failed to fetch with order query, trying without query:', queryError);
        response = await tablesDB.listRows({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: APPWRITE_CATEGORY_COLLECTION_ID,
          queries: [Query.limit(100)],
        });
      }

      console.log('Successfully fetched categories:', response.rows.length);

      // Log first category structure for debugging
      if (response.rows.length > 0) {
        console.log('Sample category structure:', Object.keys(response.rows[0]));
        console.log('Sample category data:', response.rows[0]);
      }

      // Sort manually by order (ascending) if query ordering didn't work
      const documents = response.rows as Category[];
      if (documents.length > 0 && typeof documents[0].order === 'number') {
        // If we have order field, sort by it (ascending)
        documents.sort((a, b) => {
          const orderA = a.order ?? 0;
          const orderB = b.order ?? 0;
          return orderA - orderB; // Ascending order
        });
      } else {
        // Fallback: sort by display name if order field doesn't exist
        documents.sort((a, b) => getCategoryName(a).localeCompare(getCategoryName(b)));
      }

      return documents;
    } catch (error: unknown) {
      // Enhanced error logging
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { message?: string; code?: string; type?: string };
        console.error('Error fetching categories:', {
          message: errorObj.message,
          code: errorObj.code || 'unknown',
          type: errorObj.type || 'unknown',
          databaseId: APPWRITE_DATABASE_ID,
          collectionId: APPWRITE_CATEGORY_COLLECTION_ID,
        });
      } else {
        console.error('Unknown error fetching categories:', error);
      }

      // Provide helpful error message
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to fetch categories';

      if (errorMessage.includes('404') || errorMessage.includes('Route not found')) {
        const detailedError = new Error(
          `Category collection not found (404). Please verify:\n` +
          `1. Database ID is set: ${APPWRITE_DATABASE_ID ? '✅' : '❌ Missing APPWRITE_DATABASE_ID'}\n` +
          `2. Collection ID: "${APPWRITE_CATEGORY_COLLECTION_ID}"\n` +
          `3. The collection "${APPWRITE_CATEGORY_COLLECTION_ID}" exists in database "${APPWRITE_DATABASE_ID}"\n` +
          `4. Your Appwrite project has the correct API key and permissions\n` +
          `5. Check your Appwrite console to verify the database and collection IDs`
        );
        console.error(detailedError.message);
        throw detailedError;
      }

      throw error;
    }
  }

  async getCategoryById(categoryId: string): Promise<Category | null> {
    try {
      this.validateConfig();

      const category = await tablesDB.getRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_CATEGORY_COLLECTION_ID,
        rowId: categoryId,
      });

      return category as unknown as Category;
    } catch (error: any) {
      console.error('Get category by ID error:', error);
      return null;
    }
  }

  /**
   * Converts categories to category names array
   * @param categories Array of category documents
   * @returns string[] Array of category names
   */
  categoriesToNames(categories: Category[]): string[] {
    return categories.map((category) => getCategoryName(category));
  }
}

export const categoryService = new CategoryService();

