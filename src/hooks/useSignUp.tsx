import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

interface PasswordRequirements {
  capital: boolean;
  numerical: boolean;
  special: boolean;
  match: boolean;
}

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  fullName?: string;
  nickname?: string;
}

export const useSignUp = () => {
  const { signUp, isLoading, clearError } = useAuthStore();

  const validatePasswordRequirements = useCallback(
    (password: string, confirmPassword: string): PasswordRequirements => {
      const hasCapital = /[A-Z]/.test(password);
      const hasNumerical = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const passwordsMatch = password === confirmPassword && password.length > 0;

      return {
        capital: hasCapital,
        numerical: hasNumerical,
        special: hasSpecial,
        match: passwordsMatch,
      };
    },
    []
  );

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateSignUpForm = useCallback(
    (data: SignUpData): { isValid: boolean; error?: string } => {
      const { email, password, confirmPassword, agreeToTerms } = data;

      if (!email.trim()) {
        return { isValid: false, error: 'Email is required.' };
      }

      if (!validateEmail(email)) {
        return { isValid: false, error: 'Please enter a valid email address.' };
      }

      if (!password) {
        return { isValid: false, error: 'Password is required.' };
      }

      const requirements = validatePasswordRequirements(password, confirmPassword);

      if (!requirements.capital) {
        return {
          isValid: false,
          error: 'Password must contain at least one capital letter.',
        };
      }

      if (!requirements.numerical) {
        return {
          isValid: false,
          error: 'Password must contain at least one number.',
        };
      }

      if (!requirements.special) {
        return {
          isValid: false,
          error: 'Password must contain at least one special character.',
        };
      }

      if (!requirements.match) {
        return {
          isValid: false,
          error: 'Passwords do not match.',
        };
      }

      if (!agreeToTerms) {
        return {
          isValid: false,
          error: 'Please agree to the Terms & Conditions and Privacy Policy.',
        };
      }

      return { isValid: true };
    },
    [validateEmail, validatePasswordRequirements]
  );

  const parseSignUpError = useCallback((error: any): string => {
    const message = error?.message || '';

    if (message.includes('Invalid Origin')) {
      return 'App configuration error. Please contact support.';
    }

    if (message.includes('user with the same email already exists')) {
      return 'An account with this email already exists. Please sign in instead.';
    }

    if (message.includes('Invalid email')) {
      return 'Please enter a valid email address.';
    }

    if (message.includes('Password must be')) {
      return 'Password does not meet the minimum requirements.';
    }

    if (message.includes('Network')) {
      return 'Network error. Please check your internet connection and try again.';
    }

    return message || 'An error occurred during sign up. Please try again.';
  }, []);

  const handleSignUp = useCallback(
    async (
      data: SignUpData,
      callbacks: {
        onSuccess: () => void;
        onError?: (error: Error & { message: string }) => void;
      }
    ): Promise<void> => {
      const { email, password, fullName, nickname } = data;

      const validation = validateSignUpForm(data);
      if (!validation.isValid) {
        const validationError = new Error(validation.error || 'Please check your input.') as Error & { message: string };
        if (callbacks.onError) {
          callbacks.onError(validationError);
        }
        return;
      }

      clearError();

      try {
        await signUp(email, password, fullName, nickname);
        callbacks.onSuccess();
      } catch (err: any) {
        const errorMessage = parseSignUpError(err);
        const errorWithMessage = new Error(errorMessage) as Error & { message: string };
        errorWithMessage.message = errorMessage;

        if (callbacks.onError) {
          callbacks.onError(errorWithMessage);
        }
      }
    },
    [validateSignUpForm, clearError, signUp, parseSignUpError]
  );

  const getPasswordStrength = useCallback(
    (password: string): { strength: 'weak' | 'medium' | 'strong'; score: number } => {
      let score = 0;

      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

      if (score <= 2) return { strength: 'weak', score };
      if (score <= 4) return { strength: 'medium', score };
      return { strength: 'strong', score };
    },
    []
  );

  return {
    isLoading,
    validatePasswordRequirements,
    validateEmail,
    validateSignUpForm,
    handleSignUp,
    getPasswordStrength,
  };
};