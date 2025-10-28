import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  useDerivedValue, 
  runOnJS 
} from 'react-native-reanimated';
import {
  BackdropFilter,
  Blur,
  Canvas,
  Image as SkiaImage,
  Rect,
  rrect,
  Text as SkiaText,
  useFont,
  useImage,
} from '@shopify/react-native-skia';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import BookmarkIcon from '../../assets/icons/bookmark';
import { Cinzel_400Regular } from '@expo-google-fonts/cinzel';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';

type RootStackParamList = {
  TemptationDetails: {
    temptationTitle: string;
  };
};

type TemptationDetailsRouteProp = RouteProp<RootStackParamList, 'TemptationDetails'>;
type TemptationDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TemptationDetails'>;

// Static waveform component
const WaveformIcon: React.FC<{ isActive?: boolean; isPlaying?: boolean }> = ({ 
  isActive = false, 
  isPlaying = false 
}) => {
  const waveformColor = isActive ? '#8B5CF6' : '#FFFFFF';
  
  return (
    <View style={styles.waveformContainer}>
      {Array.from({ length: 20 }, (_, i) => (
        <View
          key={i}
          style={[
            styles.waveformBar,
            {
              backgroundColor: waveformColor,
              height: Math.random() * 20 + 8,
              opacity: isActive && i < 8 ? 1 : 0.6,
            },
          ]}
        />
      ))}
    </View>
  );
};

// Media player control component
const MediaPlayerControl: React.FC<{ icon: string; onPress: () => void }> = ({ icon, onPress }) => (
  <TouchableOpacity style={styles.mediaControl} onPress={onPress}>
    <Text style={styles.mediaControlText}>{icon}</Text>
  </TouchableOpacity>
);

// Reflection question item component
const ReflectionQuestionItem: React.FC<{ 
  isPlaying?: boolean; 
  onPress: () => void;
}> = ({ isPlaying = false, onPress }) => (
  <TouchableOpacity style={styles.reflectionItem} onPress={onPress}>
    <WaveformIcon isActive={isPlaying} isPlaying={isPlaying} />
    <TouchableOpacity style={styles.playButton}>
      <Text style={styles.playButtonIcon}>
        {isPlaying ? '⏸' : '▶'}
      </Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function TemptationDetails() {
  const navigation = useNavigation<TemptationDetailsNavigationProp>();
  const route = useRoute<TemptationDetailsRouteProp>();
  const insets = useSafeAreaInsets();
  
  const { temptationTitle } = route.params;
  const [activeButton, setActiveButton] = useState<'recovery' | 'support'>('recovery');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:05');
  const [totalTime] = useState('03:00');

  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/main-bg.png'));
  const font = useFont(Roboto_400Regular, 13);
  const cardFont = useFont(Roboto_400Regular, 16);

  // Reanimated shared values for entrance animations
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const canvasOpacity = useSharedValue(0);
  const canvasTranslateY = useSharedValue(50);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  // Animation setup for tab indicator using Reanimated
  const indicatorPosition = useSharedValue(60); // Start at Recovery position
  const [skiaIndicatorPosition, setSkiaIndicatorPosition] = useState(60);
  
  // Create a derived value that updates the Skia position
  const animatedPosition = useDerivedValue(() => {
    'worklet';
    runOnJS(setSkiaIndicatorPosition)(indicatorPosition.value);
    return indicatorPosition.value;
  });

  // Entrance animations on mount
  useEffect(() => {
    const animateComponents = () => {
      // Header animation
      headerOpacity.value = withTiming(1, { duration: 600 });
      headerTranslateY.value = withTiming(0, { duration: 600 });
      
      // Canvas animation with delay
      canvasOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
      canvasTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }));
      
      // Content animation with delay
      contentOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
      contentTranslateY.value = withDelay(400, withTiming(0, { duration: 600 }));
    };

    // Start animation after fonts are loaded
    const timer = setTimeout(animateComponents, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const targetPosition = activeButton === 'recovery' ? 60 : width - 180;
    indicatorPosition.value = withTiming(targetPosition, { duration: 300 });
  }, [activeButton, width, indicatorPosition]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const canvasAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: canvasOpacity.value,
      transform: [{ translateY: canvasTranslateY.value }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleButtonPress = (buttonId: 'recovery' | 'support') => {
    setActiveButton(buttonId);
  };

  // Press animation for tab buttons
  const handleTabPressIn = () => {
    // Add subtle press feedback if needed
  };

  const handleTabPressOut = () => {
    // Reset press feedback if needed
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    // Mock rewind functionality
  };

  const handleForward = () => {
    // Mock forward functionality
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top }, headerAnimatedStyle]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nevermore</Text>
        <TouchableOpacity style={styles.bookmarkButton}>
          <BookmarkIcon />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.canvasContainer, canvasAnimatedStyle]}>
        <Canvas style={styles.canvas}>
        {/* Background Image */}
        <SkiaImage image={bg} x={0} y={0} width={width} height={900} fit="cover" />

        {/* Single Blurred Tab Container */}
        <BackdropFilter
          filter={<Blur blur={5} />}
          clip={rrect({ x: 50, y: 200, width: width - 100, height: 50 }, 8, 8)}
        >
          <Rect
            x={50}
            y={200}
            width={width - 100}
            height={50}
            color="rgba(255,255,255,0.1)"
          />
        </BackdropFilter>

        {/* Purple Active Indicator */}
        <BackdropFilter
          filter={<Blur blur={5} />}
          clip={rrect({ 
            x: skiaIndicatorPosition, 
            y: 205, 
            width: 120, 
            height: 40 
          }, 6, 6)}
        >
          <Rect
            x={skiaIndicatorPosition}
            y={205}
            width={120}
            height={40}
            color="#8B5CF6"
          />
        </BackdropFilter>

        {/* Tab Text */}
        <SkiaText
          x={120 - (cardFont?.getTextWidth('Recovery') || 0) / 2}
          y={230}
          text="Recovery"
          font={cardFont}
          color="white"
        />

        <SkiaText
          x={width - 120 - (cardFont?.getTextWidth('Support') || 0) / 2}
          y={230}
          text="Support"
          font={cardFont}
          color="white"
        />
      </Canvas>
      </Animated.View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.recoveryButton}
        onPress={() => handleButtonPress('recovery')}
        onPressIn={handleTabPressIn}
        onPressOut={handleTabPressOut}
        activeOpacity={0.8}
      />

      <TouchableOpacity
        style={styles.supportButton}
        onPress={() => handleButtonPress('support')}
        onPressIn={handleTabPressIn}
        onPressOut={handleTabPressOut}
        activeOpacity={0.8}
      />

      <Animated.ScrollView 
        style={[styles.content, contentAnimatedStyle]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Main Title */}
        <Text style={styles.mainTitle}>{temptationTitle}</Text>

        {/* Media Player */}
        <View style={styles.mediaPlayerCard}>
          <View style={styles.mediaControls}>
            <MediaPlayerControl icon="⏪ 10" onPress={handleRewind} />
            <TouchableOpacity style={styles.playButtonMain} onPress={handlePlayPause}>
              <Text style={styles.playButtonMainIcon}>{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <Text style={styles.stopButtonIcon}>⏹</Text>
            </TouchableOpacity>
            <MediaPlayerControl icon="10 ⏩" onPress={handleForward} />
          </View>
          
          {/* Progress Bar */}
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

        {/* Hospital Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Hospital Bed Image</Text>
          </View>
        </View>

        {/* Transcript Section */}
        <View style={styles.transcriptSection}>
          <View style={styles.transcriptHeader}>
            <Text style={styles.sectionTitle}>Transcript</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.transcriptText}>
            A light roast of the mental gymnastics we pull when we know we should probably see a doctor but decide that Googling "random chest tightness after coffee" at 2 AM is basically the same thing. This one's for anyone who has ever convinced themselves that if they just wait it out, their body will...
          </Text>
        </View>

        {/* Reflection Questions */}
        <View style={styles.reflectionSection}>
          <Text style={styles.sectionTitle}>Reflection Questions</Text>
          <View style={styles.reflectionContainer}>
            <ReflectionQuestionItem isPlaying={true} onPress={() => {}} />
            <ReflectionQuestionItem onPress={() => {}} />
            <ReflectionQuestionItem onPress={() => {}} />
            <ReflectionQuestionItem onPress={() => {}} />
            <ReflectionQuestionItem onPress={() => {}} />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Roboto_400Regular',
  },
  bookmarkButton: {
    padding: 8,
  },
  canvasContainer: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  recoveryButton: {
    position: 'absolute',
    left: 60,
    top: 205,
    width: 120,
    height: 40,
    borderRadius: 6,
    zIndex: 10,
  },
  supportButton: {
    position: 'absolute',
    right: 60,
    top: 205,
    width: 120,
    height: 40,
    borderRadius: 6,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 280,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 20,
    textAlign: 'left',
  },
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
  },
  mediaControlText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  playButtonMain: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonMainIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stopButton: {
    padding: 8,
  },
  stopButtonIcon: {
    color: '#FFFFFF',
    fontSize: 16,
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
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
  },
  imageContainer: {
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  transcriptSection: {
    marginBottom: 30,
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto_400Regular',
  },
  viewAllLink: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  transcriptText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Roboto_400Regular',
  },
  reflectionSection: {
    marginBottom: 30,
  },
  reflectionContainer: {
    marginTop: 15,
  },
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
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 30,
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
