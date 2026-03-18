import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { userProfileService } from '../services/userProfile.service';
import { getCurrentUser } from '../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PURPOSE_STORAGE_KEY = '@nevermore:user_purpose';

type InputState = 'default' | 'error' | 'success' | 'checking';
type PurposeType = 'seek-help' | 'help-someone';

interface UseNicknameReturn {
  nickname: string;
  setNickname: (value: string) => void;
  inputState: InputState;
  errorMessage: string;
  isLoading: boolean;
  saveNickname: () => Promise<void>;
  skipNickname: () => Promise<void>;
  isNextEnabled: boolean;
  storedPurpose: PurposeType | null;
}

export function useNickname(): UseNicknameReturn {
  const [nickname, setNickname] = useState('');
  const [existingNickname, setExistingNickname] = useState<string | null>(null);
  const [inputState, setInputState] = useState<InputState>('default');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [storedPurpose, setStoredPurpose] = useState<PurposeType | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    AsyncStorage.getItem(PURPOSE_STORAGE_KEY).then((value) => {
      if (value === 'seek-help' || value === 'help-someone') {
        setStoredPurpose(value);
      }
    });
  }, []);

  // Prefill nickname if it was already set previously.
  useEffect(() => {
    let cancelled = false;

    const hydrateExistingNickname = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;

        const userProfile = await userProfileService.getUserProfileByAuthId(currentUser.$id);
        const saved = userProfile?.nickname?.trim();

        if (cancelled) return;

        if (saved) {
          setExistingNickname(saved);
          setNickname(saved);
          setInputState('success');
          setErrorMessage('');
        } else {
          setExistingNickname(null);
        }
      } catch (e) {
        // If hydration fails we fall back to empty nickname;
        // user can still set it manually.
        if (!cancelled) setExistingNickname(null);
      }
    };

    hydrateExistingNickname();
    return () => {
      cancelled = true;
    };
  }, [user?.$id]);

  const checkNicknameAvailability = useCallback(async (value: string) => {
    if (!value.trim()) {
      setInputState('default');
      setErrorMessage('');
      return;
    }

    // If user already owns this nickname, treat as available.
    if (existingNickname && value.trim() === existingNickname) {
      setInputState('success');
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
  }, [existingNickname]);

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

      setExistingNickname(nickname.trim());

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
    storedPurpose,
  };
}