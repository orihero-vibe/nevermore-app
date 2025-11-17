import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PURPOSE_STORAGE_KEY = '@nevermore:user_purpose';

type PurposeType = 'seek-help' | 'help-someone';
type UserType = 'patient' | 'coach';

interface UsePurposeReturn {
  selectedPurpose: PurposeType | null;
  setSelectedPurpose: (purpose: PurposeType | null) => void;
  savePurpose: (purpose: PurposeType) => Promise<void>;
  getUserType: () => Promise<UserType>;
  clearPurpose: () => Promise<void>;
}

export function usePurpose(): UsePurposeReturn {
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeType | null>(null);

  const savePurpose = useCallback(async (purpose: PurposeType) => {
    try {
      await AsyncStorage.setItem(PURPOSE_STORAGE_KEY, purpose);
      setSelectedPurpose(purpose);
    } catch (error) {
      console.error('Error saving purpose:', error);
      throw error;
    }
  }, []);

  const getUserType = useCallback(async (): Promise<UserType> => {
    try {
      const purpose = await AsyncStorage.getItem(PURPOSE_STORAGE_KEY);
      if (purpose === 'seek-help') {
        return 'patient';
      } else if (purpose === 'help-someone') {
        return 'coach';
      }
      // Default to patient if no purpose is set
      return 'patient';
    } catch (error) {
      console.error('Error getting user type:', error);
      return 'patient';
    }
  }, []);

  const clearPurpose = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(PURPOSE_STORAGE_KEY);
      setSelectedPurpose(null);
    } catch (error) {
      console.error('Error clearing purpose:', error);
    }
  }, []);

  return {
    selectedPurpose,
    setSelectedPurpose,
    savePurpose,
    getUserType,
    clearPurpose,
  };
}

