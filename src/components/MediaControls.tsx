import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackwardIcon from '../assets/icons/backward10';
import Forward10Icon from '../assets/icons/forward10';
import PlayIcon from '../assets/icons/play';
import PauseIcon from '../assets/icons/pause';
import StopButtonIcon from '../assets/icons/stop-button';

type MediaControlsProps = {
  isPlaying: boolean;
  currentTime: string;
  totalTime: string;
  onPlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
  onStop: () => void;
};

export const MediaControls: React.FC<MediaControlsProps> = ({
  isPlaying,
  currentTime,
  totalTime,
  onPlayPause,
  onRewind,
  onForward,
  onStop,
}) => {
  return (
    <View style={styles.mediaPlayerCard}>
      <View style={styles.mediaControls}>
        <TouchableOpacity style={styles.mediaControl} onPress={onRewind}>
          <BackwardIcon width={36} height={36} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButtonMain} onPress={onPlayPause}>
          {isPlaying ? (
            <PauseIcon width={36} height={36} color="#FFFFFF" />
          ) : (
            <PlayIcon width={36} height={36} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.stopButton} onPress={onStop}>
          <StopButtonIcon width={28} height={28} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaControl} onPress={onForward}>
          <Forward10Icon width={36} height={36} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
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
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    width: '5%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space_between',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
  },
});

MediaControls.displayName = 'MediaControls';



