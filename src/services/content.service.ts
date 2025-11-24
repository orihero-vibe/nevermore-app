import { Query } from 'react-native-appwrite';
import { tablesDB } from './appwrite.config';
import { APPWRITE_DATABASE_ID, APPWRITE_CONTENT_COLLECTION_ID } from '@env';

export interface Content {
  $id: string;
  title: string;
  role?: string;
  category?: string | { $id: string; name?: string; title?: string; label?: string; [key: string]: unknown };
  type: string;
  transcript?: string;
  images?: string[];
  files?: string[];
  tasks?: string[];
  $createdAt?: string;
  $updatedAt?: string;
  [key: string]: unknown;
}

export function getContentCategoryId(content: Content): string | null {
  if (!content.category) return null;
  if (typeof content.category === 'string') return content.category;
  if (typeof content.category === 'object' && content.category.$id) return content.category.$id;
  return null;
}

class ContentService {
  private validateConfig(): void {
    if (!APPWRITE_DATABASE_ID) {
      const error = new Error(
        'APPWRITE_DATABASE_ID is not set in environment variables. Please add it to your .env file.'
      );
      console.error('Configuration Error:', error.message);
      throw error;
    }
    if (!APPWRITE_CONTENT_COLLECTION_ID) {
      const error = new Error(
        'APPWRITE_CONTENT_COLLECTION_ID is not set in environment variables. Please add it to your .env file.'
      );
      console.error('Configuration Error:', error.message);
      throw error;
    }
  }

  async getContent(): Promise<Content[]> {
    this.validateConfig();

    try {
      const response = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_CONTENT_COLLECTION_ID,
        queries: [
          Query.limit(1000),
        ],
      });

      return response.rows as unknown as Content[];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { message?: string; code?: string; type?: string };
        console.error('Error fetching content:', {
          message: errorObj.message,
          code: errorObj.code || 'unknown',
          type: errorObj.type || 'unknown',
          databaseId: APPWRITE_DATABASE_ID,
          collectionId: APPWRITE_CONTENT_COLLECTION_ID,
        });
      } else {
        console.error('Unknown error fetching content:', error);
      }

      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to fetch content';

      if (errorMessage.includes('404') || errorMessage.includes('Route not found')) {
        const detailedError = new Error(
          `Content collection not found (404). Please verify:\n` +
          `1. Database ID is set: ${APPWRITE_DATABASE_ID ? '✅' : '❌ Missing APPWRITE_DATABASE_ID'}\n` +
          `2. Collection ID: "${APPWRITE_CONTENT_COLLECTION_ID}"\n` +
          `3. The collection "${APPWRITE_CONTENT_COLLECTION_ID}" exists in database "${APPWRITE_DATABASE_ID}"\n` +
          `4. Your Appwrite project has the correct API key and permissions\n` +
          `5. Check your Appwrite console to verify the database and collection IDs`
        );
        console.error(detailedError.message);
        throw detailedError;
      }

      throw error;
    }
  }

  async getContentByCategory(categoryId: string): Promise<Content[]> {
    this.validateConfig();

    try {
      const response = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_CONTENT_COLLECTION_ID,
        queries: [
          Query.equal('category', categoryId),
          Query.limit(1000),
        ],
      });

      return response.rows as unknown as Content[];
    } catch (error: unknown) {
      console.error('Error fetching content by category:', error);
      throw error;
    }
  }

  async getContentById(contentId: string): Promise<Content | null> {
    try {
      this.validateConfig();

      const content = await tablesDB.getRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_CONTENT_COLLECTION_ID,
        rowId: contentId,
      });

      return content as unknown as Content;
    } catch (error: any) {
      console.error('Get content by ID error:', error);
      return null;
    }
  }

  async getContentByType(type: string): Promise<Content[]> {
    this.validateConfig();

    try {
      const response = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_CONTENT_COLLECTION_ID,
        queries: [
          Query.equal('type', type),
          Query.limit(1000),
        ],
      });

      return response.rows as unknown as Content[];
    } catch (error: unknown) {
      console.error('Error fetching content by type:', error);
      throw error;
    }
  }

  async getFortyDayContent(): Promise<Content[]> {
    this.validateConfig();

    try {
      const response = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_CONTENT_COLLECTION_ID,
        queries: [
          Query.equal('type', 'forty_day_journey'),
          Query.limit(40),
        ],
      });

      return response.rows as unknown as Content[];
    } catch (error: unknown) {
      console.error('Error fetching FortyDay content:', error);
      throw error;
    }
  }

  async getContentByCategoryAndRole(categoryId: string, role: string): Promise<Content[]> {
    this.validateConfig();

    try {
      const response = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_CONTENT_COLLECTION_ID,
        queries: [
          Query.equal('category', categoryId),
          Query.equal('role', role),
          Query.limit(1000),
        ],
      });

      return response.rows as unknown as Content[];
    } catch (error: unknown) {
      console.error('Error fetching content by category and role:', error);
      throw error;
    }
  }
}

export const contentService = new ContentService();

