import { Alert } from 'react-native';
import { AppwriteException } from 'react-native-appwrite';
import { isUnauthorizedError, getErrorMessage } from './errorHandler';

interface ErrorNotificationOptions {
  skipUnauthorized?: boolean;
  title?: string;
}

export const showAppwriteError = (
  error: unknown,
  options: ErrorNotificationOptions = {}
): void => {
  const { skipUnauthorized = false, title = 'Error' } = options;
  
  if (skipUnauthorized && isUnauthorizedError(error)) {
    return;
  }
  
  const message = getErrorMessage(error);
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showSuccessNotification = (message: string, title: string = 'Success'): void => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showInfoNotification = (message: string, title: string = 'Info'): void => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};