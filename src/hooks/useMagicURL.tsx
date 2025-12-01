import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export const useMagicURL = () => {
  const { sendMagicURLLogin, createMagicURLSession, isLoading, clearError } = useAuthStore();

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const parseMagicURLError = useCallback((error: any): string => {
    const message = error?.message || '';

    if (message.includes('Invalid email')) {
      return 'Please enter a valid email address.';
    }

    if (message.includes('Network')) {
      return 'Network error. Please check your internet connection and try again.';
    }

    if (message.includes('Too many requests')) {
      return 'Too many requests. Please try again later.';
    }

    return message || 'Failed to send magic URL. Please try again.';
  }, []);

  const handleSendMagicURL = useCallback(
    async (
      email: string,
      callbacks: {
        onSuccess: () => void;
        onError?: (error: Error & { message: string }) => void;
      }
    ): Promise<void> => {
      if (!email.trim()) {
        const emailError = new Error('Please enter your email address.') as Error & { message: string };
        if (callbacks.onError) {
          callbacks.onError(emailError);
        }
        return;
      }

      if (!validateEmail(email)) {
        const validationError = new Error('Please enter a valid email address.') as Error & { message: string };
        if (callbacks.onError) {
          callbacks.onError(validationError);
        }
        return;
      }

      clearError();

      try {
        await sendMagicURLLogin(email);
        callbacks.onSuccess();
      } catch (err: any) {
        const errorMessage = parseMagicURLError(err);
        const errorWithMessage = new Error(errorMessage) as Error & { message: string };
        errorWithMessage.message = errorMessage;

        if (callbacks.onError) {
          callbacks.onError(errorWithMessage);
        }
      }
    },
    [validateEmail, clearError, sendMagicURLLogin, parseMagicURLError]
  );

  const handleCreateSession = useCallback(
    async (
      userId: string,
      secret: string,
      callbacks: {
        onSuccess: () => void;
        onError?: (error: Error & { message: string }) => void;
      }
    ): Promise<void> => {
      if (!userId || !secret) {
        const validationError = new Error('Invalid magic URL link. Missing required parameters.') as Error & { message: string };
        if (callbacks.onError) {
          callbacks.onError(validationError);
        }
        return;
      }

      clearError();

      try {
        await createMagicURLSession(userId, secret);
        callbacks.onSuccess();
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to create session. The magic link may have expired.';
        const errorWithMessage = new Error(errorMessage) as Error & { message: string };
        errorWithMessage.message = errorMessage;

        if (callbacks.onError) {
          callbacks.onError(errorWithMessage);
        }
      }
    },
    [clearError, createMagicURLSession]
  );

  return {
    isLoading,
    validateEmail,
    handleSendMagicURL,
    handleCreateSession,
  };
};

