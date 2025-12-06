import { useAudioPlayer as useExpoAudioPlayer, AudioSource } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { audioCacheService } from '../services/audioCache.service';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('--:--');
  const [progress, setProgress] = useState(0);
  const previousVolumeRef = useRef<number>(1.0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const player = useExpoAudioPlayer();

  const formatTime = (milliseconds: number): string => {
    if (!isFinite(milliseconds) || milliseconds < 0 || isNaN(milliseconds)) {
      return '00:00';
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Sync player state with React state
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (currentUri) {
      // Poll player state to keep React state in sync
      intervalRef.current = setInterval(() => {
        setIsPlaying(player.playing);
        
        // Update time and progress
        const currentTimeMs = player.currentTime * 1000;
        const durationMs = player.duration * 1000;
        
        setCurrentTime(formatTime(currentTimeMs));
        setTotalTime(isFinite(player.duration) && player.duration > 0 ? formatTime(durationMs) : '--:--');
        setProgress(player.duration > 0 && isFinite(player.duration) ? player.currentTime / player.duration : 0);
      }, 100);
    } else {
      setIsPlaying(false);
      setCurrentTime('00:00');
      setTotalTime('--:--');
      setProgress(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUri]);

  const loadAudio = async (uri: string) => {
    try {
      if (!uri || uri.trim() === '') {
        return;
      }

      // Don't reload if it's the same audio
      if (currentUri === uri) {
        return;
      }

      setIsLoading(true);
      setIsPlaying(false);

      // Always pause before loading new audio to prevent overlap
      player.pause();

      // Get cached audio URI (downloads if not cached)
      const cachedUri = await audioCacheService.getAudioUri(uri);
      
      const audioSource: AudioSource = { uri: cachedUri };
      await player.replace(audioSource);

      // Wait for duration to be available
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      while ((!isFinite(player.duration) || player.duration === 0) && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      setIsMuted(false);
      previousVolumeRef.current = 1.0;
      player.volume = 1.0;

      // Initialize time values
      const durationMs = player.duration * 1000;
      setCurrentTime('00:00');
      setTotalTime(isFinite(player.duration) && player.duration > 0 ? formatTime(durationMs) : '--:--');
      setProgress(0);

      setCurrentUri(uri);
    } catch (error) {
      console.error('Error loading audio:', error);
      setCurrentUri(null);
      setIsPlaying(false);
      setCurrentTime('00:00');
      setTotalTime('--:--');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const unloadAudio = async () => {
    try {
      if (player.playing) {
        player.pause();
      }
      
      setIsPlaying(false);
      // Don't call replace(null) - it's not supported
      // Just clear our state and let the player keep the last audio loaded
      
      setCurrentUri(null);
      setIsMuted(false);
      previousVolumeRef.current = 1.0;
      setCurrentTime('00:00');
      setTotalTime('--:--');
      setProgress(0);
    } catch (error) {
      setCurrentUri(null);
      setIsPlaying(false);
      setIsMuted(false);
      previousVolumeRef.current = 1.0;
      setCurrentTime('00:00');
      setTotalTime('--:--');
      setProgress(0);
    }
  };

  const play = async () => {
    try {
      if (!currentUri) {
        return;
      }

      if (!player.playing) {
        await player.play();
        setIsPlaying(true);
      }
    } catch (error) {
      setIsPlaying(false);
    }
  };

  const pause = async () => {
    try {
      if (!currentUri) {
        return;
      }

      if (player.playing) {
        player.pause();
        setIsPlaying(false);
      }
    } catch (error) {
    }
  };

  const stop = async () => {
    try {
      // Always try to pause, regardless of currentUri state
      player.pause();
      setIsPlaying(false);
      
      if (currentUri) {
        await player.seekTo(0);
        setCurrentTime('00:00');
        setProgress(0);
      }
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

      if (isPlaying) {
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (currentUri && player.playing) {
        player.pause();
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
