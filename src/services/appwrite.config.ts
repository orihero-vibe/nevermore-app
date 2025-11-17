import { Client, Account, Databases, ID } from 'react-native-appwrite';
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_CATEGORY_COLLECTION_ID,
  APPWRITE_USER_PROFILES_COLLECTION_ID,
  APPWRITE_PLATFORM,
} from '@env';

const appwriteConfig = {
  endpoint: APPWRITE_ENDPOINT || '',
  projectId: APPWRITE_PROJECT_ID || '',
  databaseId: APPWRITE_DATABASE_ID || '',
  collectionId: APPWRITE_CATEGORY_COLLECTION_ID || '',
  userProfilesCollectionId: APPWRITE_USER_PROFILES_COLLECTION_ID || '',
  platform: APPWRITE_PLATFORM || '',
};

const validateConfig = () => {
  const requiredFields = ['endpoint', 'projectId', 'databaseId', 'collectionId'];
  const missingFields = requiredFields.filter(
    (field) => !appwriteConfig[field as keyof typeof appwriteConfig]
  );

  if (missingFields.length > 0) {
    console.warn(
      `Missing Appwrite configuration: ${missingFields.join(', ')}. ` +
      'Please check your .env file.'
    );
  }
};

validateConfig();

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

export default appwriteConfig;