import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenNames } from '../constants/ScreenNames';

interface OnboardingState {
  isOnboardingComplete: boolean;
  currentOnboardingStep: string | null;
  setCurrentStep: (step: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isOnboardingComplete: false,
      currentOnboardingStep: null,
      
      setCurrentStep: (step: string) => {
        set({ currentOnboardingStep: step });
      },
      
      completeOnboarding: () => {
        set({ 
          isOnboardingComplete: true, 
          currentOnboardingStep: null 
        });
      },
      
      resetOnboarding: () => {
        set({ 
          isOnboardingComplete: false, 
          currentOnboardingStep: null 
        });
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

