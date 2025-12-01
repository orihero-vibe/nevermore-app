import { useAudioPlayer as useExpoAudioPlayer, AudioSource } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: string;
  totalTime: string;
  progress: number;
  isMuted: boolean;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  toggleMute: () => Promise<void>;
  seekForward: (seconds: number) => Promise<void>;
  seekBackward: (seconds: number) => Promise<void>;
  seekTo: (progress: number) => Promise<void>;
  rewind: () => Promise<void>;
  forward: () => Promise<void>;
  loadAudio: (uri: string) => Promise<void>;
  unloadAudio: () => Promise<void>;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const previousVolumeRef = useRef<number>(1.0);

  const player = useExpoAudioPlayer();

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const isPlaying = player.playing;
  const currentTimeMs = player.currentTime * 1000;
  const durationMs = player.duration * 1000;
  const currentTime = formatTime(currentTimeMs);
  const totalTime = formatTime(durationMs);
  const progress = player.duration > 0 ? player.currentTime / player.duration : 0;

  const loadAudio = async (uri: string) => {
    try {
      setIsLoading(true);

      if (!uri || uri.trim() === '') {
        setIsLoading(false);
        return;
      }

      if (player.playing) {
        player.pause();
      }

      const audioSource: AudioSource = { uri };
      player.replace(audioSource);

      setIsMuted(false);
      previousVolumeRef.current = 1.0;
      player.volume = 1.0;

      setCurrentUri(uri);
    } catch (error) {
      setCurrentUri(null);
    } finally {
      setIsLoading(false);
    }
  };

  const unloadAudio = async () => {
    try {
      if (player.playing) {
        player.pause();
      }
      
      player.replace(null);
      
      setCurrentUri(null);
      setIsMuted(false);
      previousVolumeRef.current = 1.0;
    } catch (error) {
      setCurrentUri(null);
      setIsMuted(false);
      previousVolumeRef.current = 1.0;
    }
  };

  const play = async () => {
    try {
      if (!currentUri) {
        return;
      }

      if (!player.playing) {
        player.play();
      }
    } catch (error) {
    }
  };

  const pause = async () => {
    try {
      if (!currentUri) {
        return;
      }

      if (player.playing) {
        player.pause();
      }
    } catch (error) {
    }
  };

  const stop = async () => {
    try {
      if (!currentUri) {
        return;
      }

      player.pause();
      await player.seekTo(0);
    } catch (error) {
    }
  };

  const seekForward = async (seconds: number) => {
    try {
      if (!currentUri || player.duration === 0) {
        return;
      }

      const newPosition = Math.min(
        player.currentTime + seconds,
        player.duration
      );
      await player.seekTo(newPosition);
    } catch (error) {
    }
  };

  const seekBackward = async (seconds: number) => {
    try {
      if (!currentUri) {
        return;
      }

      const newPosition = Math.max(player.currentTime - seconds, 0);
      await player.seekTo(newPosition);
    } catch (error) {
    }
  };

  const seekTo = async (progress: number) => {
    try {
      if (!currentUri || player.duration === 0) {
        return;
      }

      const clampedProgress = Math.max(0, Math.min(1, progress));
      const newPosition = clampedProgress * player.duration;
      await player.seekTo(newPosition);
    } catch (error) {
    }
  };

  const togglePlayPause = async () => {
    try {
      if (!currentUri) {
        return;
      }

      if (player.playing) {
        await pause();
      } else {
        await play();
      }
    } catch (error) {
    }
  };

  const rewind = async () => {
    await seekBackward(10);
  };

  const forward = async () => {
    await seekForward(10);
  };

  const toggleMute = async () => {
    try {
      if (!currentUri) {
        return;
      }

      if (isMuted) {
        player.volume = previousVolumeRef.current;
        setIsMuted(false);
      } else {
        previousVolumeRef.current = player.volume;
        player.volume = 0;
        setIsMuted(true);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    return () => {
      if (currentUri) {
        player.pause();
        player.replace(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isPlaying,
    isLoading,
    currentTime,
    totalTime,
    progress,
    isMuted,
    play,
    pause,
    stop,
    togglePlayPause,
    toggleMute,
    seekForward,
    seekBackward,
    seekTo,
    rewind,
    forward,
    loadAudio,
    unloadAudio,
  };
}
