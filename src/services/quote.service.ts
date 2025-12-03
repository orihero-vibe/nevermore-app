import { Query } from 'react-native-appwrite';
import { tablesDB } from './appwrite.config';
import appwriteConfig from './appwrite.config';

export interface WelcomeQuote {
  $id: string;
  author: string;
  quote: string;
  $createdAt?: string;
  $updatedAt?: string;
}

class QuoteService {
  private validateConfig(): void {
    if (!appwriteConfig.databaseId) {
      const error = new Error(
        'APPWRITE_DATABASE_ID is not set in environment variables. Please add it to your .env file.'
      );
      console.error('Configuration Error:', error.message);
      throw error;
    }
    if (!appwriteConfig.welcomeQuoteCollectionId) {
      const error = new Error(
        'APPWRITE_WELCOME_QUOTE_COLLECTION_ID is not set in environment variables. Please add it to your .env file.'
      );
      console.error('Configuration Error:', error.message);
      throw error;
    }
  }

  async getRandomQuote(): Promise<WelcomeQuote | null> {
    this.validateConfig();

    try {
      // Fetch all quotes
      const response = await tablesDB.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.welcomeQuoteCollectionId,
        queries: [
          Query.limit(100),
        ],
      });

      const quotes = response.rows as unknown as WelcomeQuote[];
      
      if (quotes.length === 0) {
        console.warn('No quotes found in the database');
        return null;
      }

      // Select a random quote
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { message?: string; code?: string; type?: string };
        console.error('Error fetching welcome quote:', {
          message: errorObj.message,
          code: errorObj.code || 'unknown',
          type: errorObj.type || 'unknown',
          databaseId: appwriteConfig.databaseId,
          collectionId: appwriteConfig.welcomeQuoteCollectionId,
        });
      } else {
        console.error('Unknown error fetching welcome quote:', error);
      }

      return null;
    }
  }

  async getAllQuotes(): Promise<WelcomeQuote[]> {
    this.validateConfig();

    try {
      const response = await tablesDB.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.welcomeQuoteCollectionId,
        queries: [
          Query.limit(100),
        ],
      });

      return response.rows as unknown as WelcomeQuote[];
    } catch (error: unknown) {
      console.error('Error fetching all quotes:', error);
      throw error;
    }
  }
}

export const quoteService = new QuoteService();

