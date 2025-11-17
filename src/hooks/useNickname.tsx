import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { userProfileService } from '../services/userProfile.service';
import { getCurrentUser } from '../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PURPOSE_STORAGE_KEY = '@nevermore:user_purpose';

type InputState = 'default' | 'error' | 'success' | 'checking';

interface UseNicknameReturn {
  nickname: string;
  setNickname: (value: string) => void;
  inputState: InputState;
  errorMessage: string;
  isLoading: boolean;
  saveNickname: () => Promise<void>;
  skipNickname: () => Promise<void>;
  isNextEnabled: boolean;
}

export function useNickname(): UseNicknameReturn {
  const [nickname, setNickname] = useState('');
  const [inputState, setInputState] = useState<InputState>('default');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const checkNicknameAvailability = useCallback(async (value: string) => {
    if (!value.trim()) {
      setInputState('default');
      setErrorMessage('');
      return;
    }

    setInputState('checking');
    setErrorMessage('');

    try {
      const isAvailable = await userProfileService.isNicknameAvailable(value);
      
      if (isAvailable) {
        setInputState('success');
        setErrorMessage('');
      } else {
        setInputState('error');
        setErrorMessage('This username is already in use. Try a different nickname.');
      }
    } catch (error: any) {
      console.error('Error checking nickname availability:', error);
      setInputState('error');
      setErrorMessage('Failed to check nickname availability. Please try again.');
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (nickname.trim()) {
        checkNicknameAvailability(nickname);
      } else {
        setInputState('default');
        setErrorMessage('');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [nickname, checkNicknameAvailability]);

  const saveNickname = useCallback(async () => {
    if (!nickname.trim() || inputState !== 'success') {
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const userProfile = await userProfileService.getUserProfileByAuthId(currentUser.$id);
      
      if (!userProfile || !userProfile.$id) {
        throw new Error('User profile not found');
      }

      // Get user type from stored purpose
      const purpose = await AsyncStorage.getItem(PURPOSE_STORAGE_KEY);
      const userType = purpose === 'seek-help' ? 'patient' : 'coach';

      await userProfileService.updateUserProfile(userProfile.$id, {
        nickname: nickname.trim(),
        type: userType,
      });

      // Clear the purpose from storage after saving
      await AsyncStorage.removeItem(PURPOSE_STORAGE_KEY);

      setIsLoading(false);
    } catch (error: any) {
      console.error('Error saving nickname:', error);
      setErrorMessage(error.message || 'Failed to save nickname. Please try again.');
      setInputState('error');
      setIsLoading(false);
      throw error;
    }
  }, [nickname, inputState]);

  const skipNickname = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return;
      }

      const userProfile = await userProfileService.getUserProfileByAuthId(currentUser.$id);
      
      if (userProfile && userProfile.$id) {
        // Get user type from stored purpose even when skipping nickname
        const purpose = await AsyncStorage.getItem(PURPOSE_STORAGE_KEY);
        const userType = purpose === 'seek-help' ? 'patient' : 'coach';

        await userProfileService.updateUserProfile(userProfile.$id, {
          type: userType,
        });

        // Clear the purpose from storage after saving
        await AsyncStorage.removeItem(PURPOSE_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error updating user type on skip:', error);
    }
  }, []);

  const isNextEnabled = nickname.trim() && inputState === 'success' && !isLoading;

  return {
    nickname,
    setNickname,
    inputState,
    errorMessage,
    isLoading,
    saveNickname,
    skipNickname,
    isNextEnabled: isNextEnabled as boolean,
  };
}