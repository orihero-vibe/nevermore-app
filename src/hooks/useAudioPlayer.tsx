import { Audio, AVPlaybackStatus } from 'expo-av';
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

/**
 * Custom hook to manage audio playback using expo-av
 */
export function useAudioPlayer(): UseAudioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef<number>(1.0);

  const soundRef = useRef<Audio.Sound | null>(null);

  // Format milliseconds to MM:SS
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Playback status update handler
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.error(`Audio playback error: ${status.error}`);
      }
      return;
    }

    setIsPlaying(status.isPlaying);
    setCurrentTime(formatTime(status.positionMillis));

    if (status.durationMillis) {
      setTotalTime(formatTime(status.durationMillis));
      setProgress(status.positionMillis / status.durationMillis);
    }

    // Handle playback finished
    if (status.didJustFinish && !status.isLooping) {
      setIsPlaying(false);
      setProgress(1);
    }
  };

  // Load audio from URI
  const loadAudio = async (uri: string) => {
    try {
      setIsLoading(true);

      // Validate URI
      if (!uri || uri.trim() === '') {
        console.warn('Cannot load audio: empty URI provided');
        return;
      }

      console.log('Loading audio from URI:', uri);

      // Unload previous audio if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Create and load the sound
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;

      // Reset mute state and set volume to 1.0 for new audio
      setIsMuted(false);
      previousVolumeRef.current = 1.0;
      await sound.setVolumeAsync(1.0);

      // Get initial status
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        setTotalTime(formatTime(status.durationMillis));
      }

      console.log('Audio loaded successfully');
    } catch (error) {
      console.error('Error loading audio:', error);
      
      // Log full error details for debugging
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: (error as any).message,
          code: (error as any).code,
          nativeError: (error as any).nativeStackIOS || (error as any).nativeStackAndroid,
        });
      }
      
      // Provide helpful error messages
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as Error).message;
        if (errorMessage.includes('-16044') || errorMessage.includes('CoreMediaErrorDomain')) {
          console.error(
            '\n⚠️  AUDIO FILE ACCESS ERROR ⚠️\n' +
            'The audio file cannot be loaded. This is usually a permissions issue.\n\n' +
            'SOLUTION: Make your Appwrite Storage bucket publicly readable:\n' +
            '1. Go to Appwrite Console → Storage → Your Bucket\n' +
            '2. Click "Settings" → "Permissions"\n' +
            '3. Add a new permission\n' +
            '4. Select "Any" role (this allows unauthenticated access)\n' +
            '5. Enable "Read" permission ✅\n' +
            '6. Save changes\n\n' +
            'Alternative checks:\n' +
            '- Ensure the audio file format is supported (MP3, M4A, WAV, AAC)\n' +
            '- Verify APPWRITE_STORAGE_BUCKET_ID is correct in .env\n' +
            '- Check that the file exists in the bucket\n' +
            '- Try accessing the URL in a browser to test\n'
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Unload audio
  const unloadAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
      setCurrentTime('00:00');
      setTotalTime('00:00');
      setProgress(0);
      setIsMuted(false);
      previousVolumeRef.current = 1.0;
    } catch (error) {
      console.error('Error unloading audio:', error);
    }
  };

  // Play audio
  const play = async () => {
    try {
      if (!soundRef.current) {
        console.warn('No audio loaded');
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Pause audio
  const pause = async () => {
    try {
      if (!soundRef.current) {
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.pauseAsync();
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  // Stop audio (pause and reset to beginning)
  const stop = async () => {
    try {
      if (!soundRef.current) {
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        // stopAsync already resets position to 0, no need to call setPositionAsync
        await soundRef.current.stopAsync();
      }
    } catch (error) {
      // Silently handle "Seeking interrupted" errors as they're benign
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as Error).message;
        if (!errorMessage.includes('Seeking interrupted')) {
          console.error('Error stopping audio:', error);
        }
      }
    }
  };

  // Seek forward by specified seconds
  const seekForward = async (seconds: number) => {
    try {
      if (!soundRef.current) {
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        const newPosition = Math.min(
          status.positionMillis + seconds * 1000,
          status.durationMillis
        );
        await soundRef.current.setPositionAsync(newPosition);
      }
    } catch (error) {
      // Silently handle "Seeking interrupted" errors as they're benign
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as Error).message;
        if (!errorMessage.includes('Seeking interrupted')) {
          console.error('Error seeking forward:', error);
        }
      }
    }
  };

  // Seek backward by specified seconds
  const seekBackward = async (seconds: number) => {
    try {
      if (!soundRef.current) {
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(status.positionMillis - seconds * 1000, 0);
        await soundRef.current.setPositionAsync(newPosition);
      }
    } catch (error) {
      // Silently handle "Seeking interrupted" errors as they're benign
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as Error).message;
        if (!errorMessage.includes('Seeking interrupted')) {
          console.error('Error seeking backward:', error);
        }
      }
    }
  };

  // Seek to a specific progress position (0-1)
  const seekTo = async (progress: number) => {
    try {
      if (!soundRef.current) {
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const newPosition = clampedProgress * status.durationMillis;
        await soundRef.current.setPositionAsync(newPosition);
      }
    } catch (error) {
      // Silently handle "Seeking interrupted" errors as they're benign
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as Error).message;
        if (!errorMessage.includes('Seeking interrupted')) {
          console.error('Error seeking to position:', error);
        }
      }
    }
  };

  // Toggle between play and pause
  const togglePlayPause = async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  };

  // Convenience method: rewind by default 10 seconds
  const rewind = async () => {
    await seekBackward(10);
  };

  // Convenience method: forward by default 10 seconds
  const forward = async () => {
    await seekForward(10);
  };

  // Toggle mute/unmute
  const toggleMute = async () => {
    try {
      if (!soundRef.current) {
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (isMuted) {
          // Unmute: restore previous volume
          await soundRef.current.setVolumeAsync(previousVolumeRef.current);
          setIsMuted(false);
        } else {
          // Mute: save current volume and set to 0
          const currentVolume = status.volume ?? 1.0;
          previousVolumeRef.current = currentVolume;
          await soundRef.current.setVolumeAsync(0);
          setIsMuted(true);
        }
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
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

