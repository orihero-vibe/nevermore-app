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
  sendMagicURLLogin: (email: string) => Promise<void>;
  createMagicURLSession: (userId: string, secret: string) => Promise<void>;
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
      
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to sign out', 
        isLoading: false 
      });
      set({ user: null, isAuthenticated: false });
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.deleteAccount();
      
      useBookmarkStore.getState().clearBookmarks();
      useFortyDayStore.getState().clearProgress();
      
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

  sendMagicURLLogin: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.createMagicURLToken(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to send magic URL email', 
        isLoading: false 
      });
      throw error;
    }
  },

  createMagicURLSession: async (userId: string, secret: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.createMagicURLSession(userId, secret);
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to create session', 
        isLoading: false,
        isAuthenticated: false 
      });
      throw error;
    }
  },
}));