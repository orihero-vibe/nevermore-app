import React from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import PlayIcon from '../assets/icons/play';
import PauseIcon from '../assets/icons/pause';
import { WaveformIcon } from './WaveformIcon';

type ReflectionQuestionItemProps = {
  isPlaying?: boolean;
  isLoading?: boolean;
  onPress: () => void;
};

export const ReflectionQuestionItem: React.FC<ReflectionQuestionItemProps> = ({
  isPlaying = false,
  isLoading = false,
  onPress
}) => (
  <TouchableOpacity style={styles.reflectionItem} onPress={onPress} disabled={isLoading}>
    <WaveformIcon isActive={isPlaying || isLoading} isPlaying={isPlaying} />
    <View style={[styles.playButton, isLoading && styles.playButtonLoading]}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : isPlaying ? (
        <PauseIcon width={16} height={16} color="#FFFFFF" />
      ) : (
        <PlayIcon width={16} height={16} color="#FFFFFF" />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  reflectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    height: 60,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonLoading: {
    backgroundColor: '#6B46B8',
  },
});

ReflectionQuestionItem.displayName = 'ReflectionQuestionItem';

