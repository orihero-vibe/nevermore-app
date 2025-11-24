import { Storage } from 'react-native-appwrite';
import { client } from './appwrite.config';
import { APPWRITE_STORAGE_BUCKET_ID } from '@env';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const storage = new Storage(client);

export interface FileMetadata {
  $id: string;
  name: string;
  sizeOriginal: number;
  mimeType: string;
  $createdAt: string;
  $updatedAt: string;
}

class StorageService {
  private validateConfig(): void {
    if (!APPWRITE_STORAGE_BUCKET_ID) {
      throw new Error(
        'APPWRITE_STORAGE_BUCKET_ID is not set in environment variables. Please add it to your .env file.'
      );
    }
  }

  async getFileMetadata(fileId: string): Promise<FileMetadata> {
    this.validateConfig();

    try {
      const file = await storage.getFile({
        bucketId: APPWRITE_STORAGE_BUCKET_ID,
        fileId,
      });

      return file as unknown as FileMetadata;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to get file metadata';

      console.error('Error getting file metadata:', error);
      throw new Error(errorMessage);
    }
  }

  extractFileIdFromUrl(url: string): string | null {
    if (!url) return null;

    if (!url.includes('/') && !url.includes('http')) {
      return url;
    }

    const match = url.match(/\/files\/([^\/]+)\//);
    if (match && match[1]) {
      return match[1];
    }

    return url;
  }

  async getFileName(fileIdOrUrl: string): Promise<string> {
    this.validateConfig();

    try {
      const fileId = this.extractFileIdFromUrl(fileIdOrUrl);
      if (!fileId) {
        return 'Transcript';
      }

      const metadata = await this.getFileMetadata(fileId);
      return metadata.name || 'Transcript';
    } catch (error: unknown) {
      console.error('Error getting file name:', error);
      return 'Transcript';
    }
  }

  async downloadFile(fileIdOrUrl: string, fileName?: string): Promise<void> {
    this.validateConfig();

    try {
      const fileId = this.extractFileIdFromUrl(fileIdOrUrl);
      if (!fileId) {
        throw new Error('Invalid file ID or URL');
      }

      let finalFileName = fileName;
      if (!finalFileName) {
        const metadata = await this.getFileMetadata(fileId);
        finalFileName = metadata.name || `file_${fileId}`;
      }

      let downloadUrl: string;
      if (isValidUrl(fileIdOrUrl)) {
        downloadUrl = fileIdOrUrl;
      } else {
        const downloadUrlResult = storage.getFileDownload({
          bucketId: APPWRITE_STORAGE_BUCKET_ID,
          fileId,
        });
        
        if (downloadUrlResult instanceof Promise) {
          const result = await downloadUrlResult;
          downloadUrl = typeof result === 'string' ? result : fileIdOrUrl;
        } else {
          downloadUrl = typeof downloadUrlResult === 'string' ? downloadUrlResult : fileIdOrUrl;
        }
      }

      const fileUri = `${FileSystem.documentDirectory}${finalFileName}`;
      
      const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri);

      if (downloadResult.status !== 200) {
        throw new Error(`Download failed with status ${downloadResult.status}`);
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert(
          'Download Complete',
          `File saved to: ${downloadResult.uri}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to download file';

      console.error('Error downloading file:', error);
      Alert.alert('Download Error', errorMessage, [{ text: 'OK' }]);
      throw error;
    }
  }
}

export const storageService = new StorageService();

