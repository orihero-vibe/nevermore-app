import { AppwriteException } from 'react-native-appwrite';

export const isUnauthorizedError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'code' in error) {
    return (error as AppwriteException).code === 401;
  }
  return false;
};

export const isAppwriteError = (error: unknown): error is AppwriteException => {
  return error instanceof AppwriteException;
};

export const getErrorMessage = (error: unknown): string => {
  if (isAppwriteError(error)) {
    return error.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};