import { useEffect, useState, useCallback } from 'react';
import { useAudioPlayer } from './useAudioPlayer';

interface UseAudioPlaylistReturn {
  selectedAudioIndex: number;
  audioPlayer: ReturnType<typeof useAudioPlayer>;
  handleAudioSelect: (index: number) => Promise<void>;
  loadPlaylist: (audioUrls: string[]) => void;
}

/**
 * Hook to manage audio playlist with selection and auto-play functionality
 * Extends useAudioPlayer to handle multiple audio files
 */
export function useAudioPlaylist(autoPlay: boolean = true): UseAudioPlaylistReturn {
  const [selectedAudioIndex, setSelectedAudioIndex] = useState<number>(0);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const audioPlayer = useAudioPlayer();

  // Load audio when selectedAudioIndex changes
  useEffect(() => {
    const loadAudio = async () => {
      if (audioUrls.length > 0 && audioUrls[selectedAudioIndex]) {
        const audioUrl = audioUrls[selectedAudioIndex];
        console.log('Loading audio from:', audioUrl);
        await audioPlayer.loadAudio(audioUrl);
      }
    };

    loadAudio();

    // Cleanup: unload audio when component unmounts
    return () => {
      audioPlayer.unloadAudio();
    };
  }, [selectedAudioIndex, audioUrls]);

  /**
   * Handle audio selection with toggle play/pause or auto-play
   */
  const handleAudioSelect = useCallback(async (index: number) => {
    if (!audioUrls[index]) {
      console.warn('Audio not found at index:', index);
      return;
    }

    // If selecting the same audio that's already playing, toggle play/pause
    if (index === selectedAudioIndex) {
      if (audioPlayer.isPlaying) {
        await audioPlayer.pause();
      } else {
        await audioPlayer.play();
      }
    } else {
      // Select new audio - useEffect will handle loading
      setSelectedAudioIndex(index);
      
      // Auto-play after the useEffect loads the new audio if enabled
      if (autoPlay) {
        // Small delay to ensure audio is loaded
        setTimeout(async () => {
          await audioPlayer.play();
        }, 100);
      }
    }
  }, [audioUrls, selectedAudioIndex, audioPlayer, autoPlay]);

  /**
   * Load playlist with audio URLs
   */
  const loadPlaylist = useCallback((urls: string[]) => {
    setAudioUrls(urls);
  }, []);

  return {
    selectedAudioIndex,
    audioPlayer,
    handleAudioSelect,
    loadPlaylist,
  };
}

