import { ID, Models, Query } from 'react-native-appwrite';
import { tablesDB } from './appwrite.config';
import { APPWRITE_DATABASE_ID, APPWRITE_SUPPORT_COLLECTION_ID } from '@env';


export type SupportReason = 
  | 'bug-issue'
  | 'feedback'
  | 'feature-request'
  | 'inappropriate-content'
  | 'other';

export type SupportStatus = 'new' | 'in-progress' | 'resolved' | 'closed';

export interface SupportTicket {
  $id?: string;
  status: SupportStatus;
  message: string;
  reason?: SupportReason;
  userProfile?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface CreateSupportTicketParams {
  message: string;
  reason?: SupportReason;
  userProfileId?: string;
}

class SupportService {
  private validateConfig(): void {
    if (!APPWRITE_DATABASE_ID || APPWRITE_DATABASE_ID.trim() === '') {
      throw new Error(
        'APPWRITE_DATABASE_ID is not configured. Please check your .env file.'
      );
    }
    if (!APPWRITE_SUPPORT_COLLECTION_ID || APPWRITE_SUPPORT_COLLECTION_ID.trim() === '') {
      console.error('Support Collection ID check:', {
        value: APPWRITE_SUPPORT_COLLECTION_ID,
        type: typeof APPWRITE_SUPPORT_COLLECTION_ID,
        isEmpty: !APPWRITE_SUPPORT_COLLECTION_ID,
        trimmed: APPWRITE_SUPPORT_COLLECTION_ID?.trim() === '',
      });
      throw new Error(
        'APPWRITE_SUPPORT_COLLECTION_ID is not configured. Please check your .env file and refer to APPWRITE_SETUP.md for setup instructions. ' +
        'Make sure to restart your development server after adding the variable.'
      );
    }
  }

  /**
   * Creates a new support ticket
   * @param params Support ticket parameters
   * @returns Promise<Models.Document> Created support ticket document
   */
  async createSupportTicket({
    message,
    reason,
    userProfileId,
  }: CreateSupportTicketParams): Promise<Models.Document> {
    try {
      this.validateConfig();
      const rowId = ID.unique();

      const ticket = await tablesDB.createRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_SUPPORT_COLLECTION_ID,
        rowId,
        data: {
          status: 'new',
          message: message.trim(),
          reason: reason || null,
          userProfile: userProfileId || null,
        },
      });

      return ticket as unknown as Models.Document;
    } catch (error: any) {
      console.error('Create support ticket error:', error.message);
      
      throw new Error(error.message || 'Failed to create support ticket');
    }
  }

  /**
   * Gets all support tickets for the current user
   * @param userProfileId The user profile ID to filter by
   * @returns Promise<SupportTicket[]> Array of support tickets
   */
  async getSupportTicketsByUser(userProfileId: string): Promise<SupportTicket[]> {
    try {
      this.validateConfig();

      const response = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_SUPPORT_COLLECTION_ID,
        queries: [
          Query.equal('userProfile', userProfileId),
          Query.orderDesc('$createdAt'),
        ],
      });

      return response.rows as unknown as SupportTicket[];
    } catch (error: any) {
      console.error('Get support tickets error:', error);
      throw new Error(error.message || 'Failed to fetch support tickets');
    }
  }

  /**
   * Gets a single support ticket by ID
   * @param ticketId The support ticket ID
   * @returns Promise<SupportTicket | null> Support ticket or null
   */
  async getSupportTicketById(ticketId: string): Promise<SupportTicket | null> {
    try {
      this.validateConfig();

      const ticket = await tablesDB.getRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_SUPPORT_COLLECTION_ID,
        rowId: ticketId,
      });

      return ticket as unknown as SupportTicket;
    } catch (error: any) {
      console.error('Get support ticket by ID error:', error);
      return null;
    }
  }
}

export const supportService = new SupportService();

