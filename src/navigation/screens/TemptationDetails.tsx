import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Canvas,
  Image as SkiaImage,
  useFont,
  useImage
} from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import BookmarkIcon from '../../assets/icons/bookmark';
import BookmarkActiveIcon from '../../assets/icons/bookmark-active';
import BackwardIcon from '../../assets/icons/backward10';
import Forward10Icon from '../../assets/icons/forward10';
import PlayIcon from '../../assets/icons/play';
import PauseIcon from '../../assets/icons/pause';
import StopButtonIcon from '../../assets/icons/stop-button';
import { MediaControls } from '../../components/MediaControls';
import { ScreenNames } from '../../constants/ScreenNames';
import { useTabSwitcher } from '../../hooks/useTabSwitcher';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { Image } from 'expo-image';

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
const MediaPlayerControl: React.FC<{ icon: React.ReactNode; onPress: () => void }> = ({ icon, onPress }) => (
  <TouchableOpacity style={styles.mediaControl} onPress={onPress}>
    {icon}
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
      {isPlaying ? (
        <PauseIcon width={16} height={16} color="#FFFFFF" />
      ) : (
        <PlayIcon width={16} height={16} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function TemptationDetails() {
  const navigation = useNavigation<TemptationDetailsNavigationProp>();
  const route = useRoute<TemptationDetailsRouteProp>();
  const insets = useSafeAreaInsets();

  console.log('route', route);


  const { temptationTitle } = route.params;
  const [activeButton, setActiveButton] = useState<'recovery' | 'support'>('recovery');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:05');
  const [totalTime] = useState('03:00');

  // Bookmark store
  const { toggleBookmark, isBookmarked } = useBookmarkStore();
  const bookmarkId = `temptation-${temptationTitle.toLowerCase().replace(/\s+/g, '-')}`;
  const isCurrentlyBookmarked = isBookmarked(bookmarkId);

  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/gradient.png'));
  const font = useFont(Roboto_400Regular, 13);
  const cardFont = useFont(Roboto_400Regular, 16);

  // Reanimated shared values for entrance animations
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const canvasOpacity = useSharedValue(0);
  const canvasTranslateY = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);



  // Entrance animations on mount
  useEffect(() => {
    const animateComponents = () => {
      // Header animation
      headerOpacity.value = withTiming(1, { duration: 600 });
      headerTranslateY.value = withTiming(10, { duration: 600 });

      // Canvas animation with delay
      canvasOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
      canvasTranslateY.value = withDelay(200, withTiming(-20, { duration: 800 }));

      // Content animation with delay
      contentOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
      contentTranslateY.value = withDelay(400, withTiming(0, { duration: 600 }));
    };

    // Start animation after fonts are loaded
    const timer = setTimeout(animateComponents, 300);
    return () => clearTimeout(timer);
  }, []);


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

  // Use the tab switcher hook
  const tabSwitcher = useTabSwitcher({
    tabs: ['Recovery', 'Support'],
    activeTab: activeButton === 'recovery' ? 'Recovery' : 'Support',
    onTabChange: (tab) => {
      const newButton = tab.toLowerCase() as 'recovery' | 'support';
      handleButtonPress(newButton);
    },
    y: 100,
  });

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

  const handleBookmarkToggle = () => {
    toggleBookmark(bookmarkId, temptationTitle);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top }, headerAnimatedStyle]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nevermore</Text>
        <View />
      </Animated.View>

      <Animated.ScrollView
        style={[styles.content, contentAnimatedStyle]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.canvasContainer, canvasAnimatedStyle]}>
          <Canvas style={styles.canvas}>
            {/* Background Image */}
            <SkiaImage image={bg} x={0} y={0} width={width} height={300} fit="cover" />
            {/* Tab Switcher Elements */}
            {tabSwitcher.containerElement}
            {tabSwitcher.indicatorElement}
            {tabSwitcher.textElements}
          </Canvas>
          {/* Tab Touchable Elements - inside ScrollView so they scroll with content */}
          {tabSwitcher.touchableElements}
        </Animated.View>


        {/* Main Title */}
        <View style={styles.mainTitleContainer}>
          <Text style={styles.mainTitle}>{temptationTitle}</Text>
          <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmarkToggle}>
            {isCurrentlyBookmarked ? (
              <BookmarkActiveIcon width={20} height={24} color="#965CDF" />
            ) : (
              <BookmarkIcon width={20} height={24} />
            )}
          </TouchableOpacity>
        </View>

        {/* Media Player */}
        <MediaControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          totalTime={totalTime}
          onPlayPause={handlePlayPause}
          onRewind={handleRewind}
          onForward={handleForward}
          onStop={handleStop}
        />

        {/* Hospital Image Placeholder */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: 'https://cdn.pixabay.com/photo/2023/10/30/12/36/hospital-8352776_640.jpg' }} style={styles.imagePlaceholder} />
        </View>

        {/* Transcript Section */}
        <View style={styles.transcriptSection}>
          <View style={styles.transcriptHeader}>
            <Text style={styles.sectionTitle}>Transcript</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  // @ts-ignore: using string enum for screen name
                  ScreenNames.TRANSCRIPT as never,
                  {
                    title: temptationTitle,
                    transcript:
                      'A light roast of the mental gymnastics we pull when we know we should probably see a doctor but decide that Googling "random chest tightness after coffee" at 2 AM is basically the same thing. This one\'s for anyone who has ever convinced themselves that if they just wait it out, their body will magically fix everything. Spoiler alert: it won’t, but at least we can laugh about it.\n\nHere\'s the full transcript content placeholder for now...'
                  } as never
                )
              }
            >
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
            <ReflectionQuestionItem isPlaying={true} onPress={() => { }} />
            <ReflectionQuestionItem onPress={() => { }} />
            <ReflectionQuestionItem onPress={() => { }} />
            <ReflectionQuestionItem onPress={() => { }} />
            <ReflectionQuestionItem onPress={() => { }} />
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
    padding: 5,
  },
  canvasContainer: {
    height: 160,
    position: 'relative',
    overflow: 'visible',
  },
  canvas: {
    height: 300,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  mainTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Cinzel_400Regular',
    textAlign: 'left',
    flex: 1,
    paddingRight: 10,
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
    width: '100%',
    height: 200,
    resizeMode: 'cover',
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
});
