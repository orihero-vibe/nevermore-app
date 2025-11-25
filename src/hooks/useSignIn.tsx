import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const useSignIn = () => {
  const { signIn, isLoading, clearError, sendPasswordRecovery } = useAuthStore();

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateSignInForm = useCallback(
    (data: SignInData): { isValid: boolean; error?: string } => {
      const { email, password } = data;

      if (!email.trim()) {
        return { isValid: false, error: 'Email is required.' };
      }

      if (!validateEmail(email)) {
        return { isValid: false, error: 'Please enter a valid email address.' };
      }

      if (!password) {
        return { isValid: false, error: 'Password is required.' };
      }

      return { isValid: true };
    },
    [validateEmail]
  );

  const parseSignInError = useCallback((error: any): string => {
    const message = error?.message || '';

    if (message.includes('Your account has been blocked')) {
      return message;
    }

    if (message.includes('Invalid credentials') || message.includes('Invalid email or password')) {
      return 'Invalid email or password. Please try again.';
    }

    if (message.includes('user with the same email could not be found')) {
      return 'No account found with this email. Please sign up first.';
    }

    if (message.includes('Invalid Origin')) {
      return 'App configuration error. Please contact support.';
    }

    if (message.includes('Network')) {
      return 'Network error. Please check your internet connection and try again.';
    }

    if (message.includes('Too many requests')) {
      return 'Too many login attempts. Please try again later.';
    }

    return message || 'Invalid email or password. Please try again.';
  }, []);

  const handleSignIn = useCallback(
    async (
      data: SignInData,
      callbacks: {
        onSuccess: () => void;
        onError?: (error: Error & { message: string }) => void;
      }
    ): Promise<void> => {
      const { email, password } = data;

      const validation = validateSignInForm(data);
      if (!validation.isValid) {
        const validationError = new Error(validation.error || 'Please check your input.') as Error & { message: string };
        if (callbacks.onError) {
          callbacks.onError(validationError);
        }
        return;
      }

      clearError();

      try {
        await signIn(email, password);
        callbacks.onSuccess();
      } catch (err: any) {
        const errorMessage = parseSignInError(err);
        const errorWithMessage = new Error(errorMessage) as Error & { message: string };
        errorWithMessage.message = errorMessage;

        if (callbacks.onError) {
          callbacks.onError(errorWithMessage);
        }
      }
    },
    [validateSignInForm, clearError, signIn, parseSignInError]
  );

  const handlePasswordRecovery = useCallback(
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

      try {
        await sendPasswordRecovery(email);
        callbacks.onSuccess();
      } catch (error: any) {
        const errorMessage = error?.message || 'Failed to send recovery email. Please try again.';
        const errorWithMessage = new Error(errorMessage) as Error & { message: string };
        errorWithMessage.message = errorMessage;

        if (callbacks.onError) {
          callbacks.onError(errorWithMessage);
        }
      }
    },
    [validateEmail, sendPasswordRecovery]
  );

  return {
    isLoading,
    validateEmail,
    validateSignInForm,
    handleSignIn,
    handlePasswordRecovery,
  };
};