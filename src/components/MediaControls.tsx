import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, PanResponder } from 'react-native';
import BackwardIcon from '../assets/icons/backward10';
import Forward10Icon from '../assets/icons/forward10';
import PlayIcon from '../assets/icons/play';
import PauseIcon from '../assets/icons/pause';
import StopButtonIcon from '../assets/icons/stop-button';

type MediaControlsProps = {
  isPlaying: boolean;
  isLoading?: boolean;
  currentTime: string;
  totalTime: string;
  progress?: number; // Progress as a decimal (0-1)
  onPlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
  onStop: () => void;
  onSeek?: (progress: number) => void;
};

export const MediaControls: React.FC<MediaControlsProps> = ({
  isPlaying,
  isLoading = false,
  currentTime,
  totalTime,
  progress = 0,
  onPlayPause,
  onRewind,
  onForward,
  onStop,
  onSeek,
}) => {
  const progressWidth = Math.min(Math.max(progress * 100, 0), 100);
  const progressBarRef = React.useRef<View>(null);
  
  // PanResponder for handling drag gestures
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isLoading && !!onSeek,
        onMoveShouldSetPanResponder: () => !isLoading && !!onSeek,
        onPanResponderGrant: (event) => {
          if (!onSeek || isLoading || !progressBarRef.current) return;
          
          progressBarRef.current.measureInWindow((x, y, width, height) => {
            if (width > 0) {
              const relativeX = event.nativeEvent.pageX - x;
              const newProgress = Math.max(0, Math.min(1, relativeX / width));
              onSeek(newProgress);
            }
          });
        },
        onPanResponderMove: (event) => {
          if (!onSeek || isLoading || !progressBarRef.current) return;
          
          progressBarRef.current.measureInWindow((x, y, width, height) => {
            if (width > 0) {
              const relativeX = event.nativeEvent.pageX - x;
              const newProgress = Math.max(0, Math.min(1, relativeX / width));
              onSeek(newProgress);
            }
          });
        },
        onPanResponderRelease: (event) => {
          if (!onSeek || isLoading || !progressBarRef.current) return;
          
          progressBarRef.current.measureInWindow((x, y, width, height) => {
            if (width > 0) {
              const relativeX = event.nativeEvent.pageX - x;
              const newProgress = Math.max(0, Math.min(1, relativeX / width));
              onSeek(newProgress);
            }
          });
        },
      }),
    [onSeek, isLoading]
  );
  
  return (
    <View style={styles.mediaPlayerCard}>
      <View style={styles.mediaControls}>
        <TouchableOpacity style={styles.mediaControl} onPress={onRewind} disabled={isLoading}>
          <BackwardIcon width={36} height={36} color={isLoading ? "#666666" : "#FFFFFF"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButtonMain} onPress={onPlayPause} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#8B5CF6" />
          ) : isPlaying ? (
            <PauseIcon width={36} height={36} color="#FFFFFF" />
          ) : (
            <PlayIcon width={36} height={36} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.stopButton} onPress={onStop} disabled={isLoading}>
          <StopButtonIcon width={36} height={36} color={isLoading ? "#666666" : "#FFFFFF"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaControl} onPress={onForward} disabled={isLoading}>
          <Forward10Icon width={36} height={36} color={isLoading ? "#666666" : "#FFFFFF"} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View
          ref={progressBarRef}
          style={styles.progressBarTouchArea}
          {...panResponder.panHandlers}
        >
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressWidth}%` }]} />
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{currentTime}</Text>
          <Text style={styles.timeText}>{totalTime}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mediaPlayerCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  mediaControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  mediaControl: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonMain: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBarTouchArea: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
  },
});

MediaControls.displayName = 'MediaControls';