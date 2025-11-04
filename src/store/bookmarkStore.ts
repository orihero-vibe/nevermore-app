import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Bookmark {
  id: string;
  title: string;
  timestamp: number;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (id: string, title: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string, title: string) => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      
      addBookmark: (id: string, title: string) => {
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            { id, title, timestamp: Date.now() }
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
      
      toggleBookmark: (id: string, title: string) => {
        const state = get();
        if (state.isBookmarked(id)) {
          state.removeBookmark(id);
        } else {
          state.addBookmark(id, title);
        }
      },
    }),
    {
      name: 'bookmark-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

