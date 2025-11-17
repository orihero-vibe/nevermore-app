import { create } from 'zustand';
import { Models } from 'react-native-appwrite';
import * as authService from '../services/auth.service';
import { useBookmarkStore } from './bookmarkStore';
import { useFortyDayStore } from './fortyDayStore';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  signUp: (email: string, password: string, name?: string, nickname?: string, type?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  sendPasswordRecovery: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  signUp: async (email: string, password: string, name?: string, nickname?: string, type?: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signUp({ email, password, name, nickname, type });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to sign up', 
        isLoading: false,
        isAuthenticated: false 
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.signIn(email, password);
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to sign in', 
        isLoading: false,
        isAuthenticated: false 
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.signOut();
      
      // User data (bookmarks, forty-day progress) is preserved in AsyncStorage
      // No need to clear stores on sign out
      
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to sign out', 
        isLoading: false 
      });
      // Even if there's an error, clear the local state
      // This ensures the user is logged out locally even if server call fails
      set({ user: null, isAuthenticated: false });
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.deleteAccount();
      
      // Clear all local data stores
      useBookmarkStore.getState().clearBookmarks();
      useFortyDayStore.getState().clearProgress();
      
      // Clear all local state after deleting account
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to delete account', 
        isLoading: false 
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  sendPasswordRecovery: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.createPasswordRecovery(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to send recovery email', 
        isLoading: false 
      });
      throw error;
    }
  },
}));