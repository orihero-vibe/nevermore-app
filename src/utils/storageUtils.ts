import { 
  APPWRITE_ENDPOINT, 
  APPWRITE_PROJECT_ID, 
  APPWRITE_STORAGE_BUCKET_ID 
} from '@env';

/**
 * Checks if a string is a valid URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Converts an Appwrite file ID to a full file URL
 * If the input is already a valid URL, returns it as-is
 * @param fileIdOrUrl - Appwrite file ID or a complete URL
 * @returns Full URL to the file in Appwrite Storage
 */
export function getFileUrl(fileIdOrUrl: string | undefined | null): string | undefined {
  if (!fileIdOrUrl) {
    return undefined;
  }

  // If it's already a valid URL, return it as-is
  if (isValidUrl(fileIdOrUrl)) {
    return fileIdOrUrl;
  }

  // Validate required configuration
  if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_STORAGE_BUCKET_ID) {
    console.error('Missing Appwrite Storage configuration:', {
      hasEndpoint: !!APPWRITE_ENDPOINT,
      hasProjectId: !!APPWRITE_PROJECT_ID,
      hasBucketId: !!APPWRITE_STORAGE_BUCKET_ID,
    });
    return undefined;
  }

  // Construct the file URL using Appwrite's REST API pattern
  // Format: {endpoint}/storage/buckets/{bucketId}/files/{fileId}/view?project={projectId}
  const fileUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_STORAGE_BUCKET_ID}/files/${fileIdOrUrl}/view?project=${APPWRITE_PROJECT_ID}`;
  
  console.log('Converted file ID to URL:', {
    fileId: fileIdOrUrl,
    url: fileUrl,
  });

  return fileUrl;
}

/**
 * Converts an array of file IDs to file URLs
 * @param fileIds - Array of Appwrite file IDs or URLs
 * @returns Array of full URLs to files in Appwrite Storage
 */
export function getFileUrls(fileIds: (string | undefined | null)[] | undefined | null): string[] {
  if (!fileIds || !Array.isArray(fileIds)) {
    return [];
  }

  return fileIds
    .map(getFileUrl)
    .filter((url): url is string => url !== undefined);
}

/**
 * Gets the first file URL from an array of file IDs
 * Useful for getting a primary audio file or image
 * @param fileIds - Array of Appwrite file IDs or URLs
 * @returns First valid URL or undefined
 */
export function getFirstFileUrl(fileIds: (string | undefined | null)[] | undefined | null): string | undefined {
  const urls = getFileUrls(fileIds);
  return urls.length > 0 ? urls[0] : undefined;
}

