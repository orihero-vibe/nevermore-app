import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Bookmark {
  id: string;
  title: string;
  timestamp: number;
  role?: string; // Role field from content (Recovery/Support)
}

interface BookmarkState {
  bookmarks: Bookmark[];
  activeTab: 'Recovery' | 'Support';
  addBookmark: (id: string, title: string, role?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string, title: string, role?: string) => void;
  clearBookmarks: () => void;
  setActiveTab: (tab: 'Recovery' | 'Support') => void;
  getFilteredBookmarks: (tab?: 'Recovery' | 'Support') => Bookmark[];
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      activeTab: 'Recovery',
      
      addBookmark: (id: string, title: string, role?: string) => {
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            { id, title, timestamp: Date.now(), role }
          ]
        }));
      },
      
      removeBookmark: (id: string) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== id)
        }));
      },
      
      isBookmarked: (id: string) => {
        return get().bookmarks.some(bookmark => bookmark.id === id);
      },
      
      toggleBookmark: (id: string, title: string, role?: string) => {
        const state = get();
        if (state.isBookmarked(id)) {
          state.removeBookmark(id);
        } else {
          state.addBookmark(id, title, role);
        }
      },
      
      clearBookmarks: () => {
        set({ bookmarks: [] });
      },

      setActiveTab: (tab: 'Recovery' | 'Support') => {
        set({ activeTab: tab });
      },

      getFilteredBookmarks: (tab?: 'Recovery' | 'Support') => {
        const state = get();
        const activeTab = tab || state.activeTab;
        const filtered = state.bookmarks.filter(bookmark => {
          return !bookmark.role || bookmark.role.toLowerCase() === activeTab.toLowerCase();
        });
        return filtered;
      },
    }),
    {
      name: 'bookmark-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);