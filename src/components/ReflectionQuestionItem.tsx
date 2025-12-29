import React from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator, Text, ImageBackground } from 'react-native';
import PlayIcon from '../assets/icons/play';
import PauseIcon from '../assets/icons/pause';
import { WaveformIcon } from './WaveformIcon';

type ReflectionQuestionItemProps = {
  isPlaying?: boolean;
  isLoading?: boolean;
  onPress: () => void;
  questionNumber?: number;
  label?: string;
  isSelected?: boolean;
};

export const ReflectionQuestionItem: React.FC<ReflectionQuestionItemProps> = ({
  isPlaying = false,
  isLoading = false,
  onPress,
  questionNumber,
  label,
  isSelected = false
}) => {
  const isActive = isPlaying || isLoading || isSelected;
  const displayLabel = label || (questionNumber !== undefined ? `Question ${questionNumber}` : undefined);
  
  return (
    <View>
      {displayLabel && (
        <Text style={styles.questionLabel}>{displayLabel}</Text>
      )}
      <TouchableOpacity style={styles.reflectionItemWrapper} onPress={onPress} disabled={isLoading}>
        {isActive ? (
          <ImageBackground
            source={require('../assets/card-bg.png')}
            style={styles.reflectionItem}
            imageStyle={styles.reflectionItemImage}
          >
            <WaveformIcon isActive={isActive} isPlaying={isPlaying} />
            <View style={[styles.playButton, isLoading && styles.playButtonLoading, {backgroundColor: isPlaying ? '#FFFFFF' : '#8B5CF6'}]}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : isPlaying ? (
                <PauseIcon style={styles.pauseIcon} width={20} height={20} color="#000000" />
              ) : (
                <PlayIcon width={20} height={20} color="#000000" />
              )}
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.reflectionItem}>
            <WaveformIcon isActive={isActive} isPlaying={isPlaying} />
            <View style={[styles.playButton, {backgroundColor: '#8B5CF6'}]}>
              <PlayIcon width={20} height={20} color="#000000" />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  questionLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 8,
    marginLeft: 4,
  },
  reflectionItemWrapper: {
    marginBottom: 12,
  },
  reflectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    height: 60,
    overflow: 'hidden',
  },
  reflectionItemImage: {
    borderRadius: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonLoading: {
    backgroundColor: '#6B46B8',
  },
  pauseIcon: {
   marginLeft: 1,
   marginTop: 1,
  },
});

ReflectionQuestionItem.displayName = 'ReflectionQuestionItem';

