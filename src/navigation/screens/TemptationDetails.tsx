import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Canvas,
  Image as SkiaImage,
  useFont,
  useImage
} from '@shopify/react-native-skia';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import BookmarkIcon from '../../assets/icons/bookmark';
import BookmarkActiveIcon from '../../assets/icons/bookmark-active';
import { MediaControls } from '../../components/MediaControls';
import { ReflectionQuestionItem } from '../../components/ReflectionQuestionItem';
import { ScreenNames } from '../../constants/ScreenNames';
import { useTabSwitcher } from '../../hooks/useTabSwitcher';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { Image } from 'expo-image';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useContentDetails, useContentByCategoryAndRole } from '../../hooks/useContent';
import { useEntranceAnimations } from '../../hooks/useEntranceAnimations';
import { useAudioPlaylist } from '../../hooks/useAudioPlaylist';
import { useContentPresentation } from '../../hooks/useContentPresentation';

type RootStackParamList = {
  TemptationDetails: {
    contentId: string;
    temptationTitle: string;
    categoryId?: string;
  };
};

type TemptationDetailsRouteProp = RouteProp<RootStackParamList, 'TemptationDetails'>;
type TemptationDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TemptationDetails'>;

export default function TemptationDetails() {
  const navigation = useNavigation<TemptationDetailsNavigationProp>();
  const route = useRoute<TemptationDetailsRouteProp>();
  const insets = useSafeAreaInsets();

  const { contentId, temptationTitle, categoryId } = route.params;
  
  // First, fetch the initial content to determine its role
  const { 
    content: initialContent, 
    loading: initialLoading 
  } = useContentDetails(contentId);
  
  // Use ref to track if we've initialized the role (doesn't trigger re-renders)
  const hasInitializedRef = React.useRef(false);
  
  // Initialize activeButton based on initial content's role
  const [activeButton, setActiveButton] = useState<'recovery' | 'support'>('recovery');
  
  // Set initial role based on first content's role (only once)
  React.useEffect(() => {
    if (initialContent && !hasInitializedRef.current) {
      const initialRole = initialContent.role?.toLowerCase();
      if (initialRole === 'support' || initialRole === 'recovery') {
        setActiveButton(initialRole as 'recovery' | 'support');
      }
      hasInitializedRef.current = true;
    }
  }, [initialContent]);
  
  // Custom hooks - fetch content by category and role (only when categoryId is provided)
  const { 
    content: roleBasedContent, 
    loading: roleBasedLoading 
  } = useContentByCategoryAndRole(categoryId || null, activeButton);
  
  // Determine which content to use
  const content = categoryId 
    ? (roleBasedContent && roleBasedContent.length > 0 ? roleBasedContent[0] : null)
    : initialContent;
  const loading = categoryId ? roleBasedLoading : initialLoading;
  
  const { headerAnimatedStyle, canvasAnimatedStyle, contentAnimatedStyle } = useEntranceAnimations();
  const { selectedAudioIndex, audioPlayer, handleAudioSelect, loadPlaylist } = useAudioPlaylist();
  const { transcript, displayImage, audioFiles } = useContentPresentation(content);
  
  // Bookmark store
  const { toggleBookmark, isBookmarked } = useBookmarkStore();
  const isCurrentlyBookmarked = content ? isBookmarked(content.$id) : false;

  // Load playlist when content is available
  const audioFilesRef = React.useRef<string[]>([]);
  React.useEffect(() => {
    // Only update if the audio files have actually changed
    const hasChanged = audioFiles.length !== audioFilesRef.current.length || 
                       audioFiles.some((file, idx) => file !== audioFilesRef.current[idx]);
    
    if (hasChanged && audioFiles.length > 0) {
      audioFilesRef.current = audioFiles;
      loadPlaylist(audioFiles);
    }
  }, [audioFiles, loadPlaylist]);

  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/gradient.png'));

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

  const handleBookmarkToggle = () => {
    if (!content) return;
    // Pass the content role to the bookmark for filtering
    toggleBookmark(content.$id, content.title || temptationTitle, content.role);
  };

  // Display loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LoadingSpinner />
      </View>
    );
  }

  // Display error state if content not found
  if (!content) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Content not found</Text>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Background */}
      <View style={styles.backgroundContainer}>
        <Canvas style={styles.backgroundCanvas}>
          <SkiaImage image={bg} x={0} y={0} width={width} height={300} fit="cover" />
        </Canvas>
      </View>

      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top }, headerAnimatedStyle]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nevermore</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <Animated.ScrollView
        style={[styles.content, contentAnimatedStyle]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.canvasContainer, canvasAnimatedStyle]}>
          <Canvas style={styles.canvas}>
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
          <Text style={styles.mainTitle}>{content.title}</Text>
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
          isPlaying={audioPlayer.isPlaying}
          isLoading={audioPlayer.isLoading}
          currentTime={audioPlayer.currentTime}
          totalTime={audioPlayer.totalTime}
          progress={audioPlayer.progress}
          onPlayPause={audioPlayer.togglePlayPause}
          onRewind={audioPlayer.rewind}
          onForward={audioPlayer.forward}
          onStop={audioPlayer.stop}
          onSeek={audioPlayer.seekTo}
        />

        {/* Image */}
        {displayImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: displayImage }} style={styles.imagePlaceholder} />
          </View>
        )}

        {/* Transcript Section */}
        {transcript && (
          <View style={styles.transcriptSection}>
            <View style={styles.transcriptHeader}>
              <Text style={styles.sectionTitle}>Transcript</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    // @ts-ignore: using string enum for screen name
                    ScreenNames.TRANSCRIPT as never,
                    {
                      title: content.title,
                      transcript: transcript
                    } as never
                  )
                }
              >
                <Text style={styles.viewAllLink}>View all</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.transcriptText} numberOfLines={4}>
              {transcript}
            </Text>
          </View>
        )}

        {/* Reflection Questions */}
        {audioFiles.length > 0 && (
          <View style={styles.reflectionSection}>
            <Text style={styles.sectionTitle}>Reflection Questions</Text>
            <FlatList
              data={audioFiles}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <ReflectionQuestionItem
                  isPlaying={index === selectedAudioIndex && audioPlayer.isPlaying}
                  isLoading={index === selectedAudioIndex && audioPlayer.isLoading}
                  onPress={() => handleAudioSelect(index)}
                />
              )}
              contentContainerStyle={styles.reflectionContainer}
              scrollEnabled={false}
            />
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 0,
  },
  backgroundCanvas: {
    height: 300,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    marginBottom: 20,
  },
  backLink: {
    color: '#8B5CF6',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
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
  headerSpacer: {
    width:40,
  },
  bookmarkButton: {
    padding: 5,
  },
  canvasContainer: {
    height: 160,
    position: 'relative',
    overflow: 'visible',
    marginTop: 20,
  },
  canvas: {
    height: 300,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  mainTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    marginBottom: 15,
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
  },
  transcriptSection: {
    marginBottom: 30,
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
  },
  transcriptText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Roboto_400Regular',
    paddingHorizontal: 20,
  },
  reflectionSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  reflectionContainer: {
    marginTop: 15,
  },
});
