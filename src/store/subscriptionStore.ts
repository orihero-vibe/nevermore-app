import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionState {
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  setSubscribed: (value: boolean) => void;
  checkSubscription: () => Promise<void>;
  purchaseSubscription: (productId: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      isSubscribed: false,
      isLoading: false,
      error: null,

      setSubscribed: (value: boolean) => {
        set({ isSubscribed: value, error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      checkSubscription: async () => {
        const { iapService } = await import('../services/iap.service');
        set({ isLoading: true, error: null });
        try {
          const isSubscribed = await iapService.checkSubscription();
          set({ isSubscribed, isLoading: false, error: null });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to check subscription';
          set({ isLoading: false, error: message });
        }
      },

      purchaseSubscription: async (productId: string): Promise<boolean> => {
        const { iapService } = await import('../services/iap.service');
        set({ isLoading: true, error: null });
        try {
          const success = await iapService.purchaseSubscription(productId);
          if (success) {
            set({ isSubscribed: true, isLoading: false, error: null });
          } else {
            set({ isLoading: false });
          }
          return success;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Purchase failed';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      restorePurchases: async (): Promise<boolean> => {
        const { iapService } = await import('../services/iap.service');
        set({ isLoading: true, error: null });
        try {
          const success = await iapService.restorePurchases();
          if (success) {
            set({ isSubscribed: true, isLoading: false, error: null });
          } else {
            set({ isLoading: false });
          }
          return success;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Restore failed';
          set({ isLoading: false, error: message });
          return false;
        }
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isSubscribed: state.isSubscribed }),
    }
  )
);
