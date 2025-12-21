import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Canvas,
  Image as SkiaImage,
  Text as SkiaText,
  useFont,
  useImage
} from '@shopify/react-native-skia';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Sharing from 'expo-sharing';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import BookmarkIcon from '../../assets/icons/bookmark';
import BookmarkActiveIcon from '../../assets/icons/bookmark-active';
import DocumentIcon from '../../assets/icons/document';
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
import { storageService } from '../../services/storage.service';
import { getContentCategoryId } from '../../services/content.service';

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

  const { contentId, temptationTitle, categoryId: routeCategoryId } = route.params;
  
  const { 
    content: initialContent, 
    loading: initialLoading 
  } = useContentDetails(contentId);
  
  const hasInitializedRef = React.useRef(false);
  
  // Extract categoryId from content if not provided in route params
  const extractedCategoryId = React.useMemo(() => {
    if (routeCategoryId && routeCategoryId.length > 0) return routeCategoryId;
    if (initialContent) {
      return getContentCategoryId(initialContent);
    }
    return null;
  }, [routeCategoryId, initialContent]);
  
  const [activeButton, setActiveButton] = useState<'recovery' | 'support'>('recovery');
  
  React.useEffect(() => {
    if (initialContent && !hasInitializedRef.current) {
      const initialRole = initialContent.role?.toLowerCase();
      if (initialRole === 'support' || initialRole === 'recovery') {
        setActiveButton(initialRole as 'recovery' | 'support');
      }
      hasInitializedRef.current = true;
    }
  }, [initialContent]);
  
  const { 
    content: roleBasedContent, 
    loading: roleBasedLoading 
  } = useContentByCategoryAndRole(extractedCategoryId || null, activeButton);
  
  // Keep showing initial content if no role-based content exists for the selected role
  const content = extractedCategoryId 
    ? (roleBasedContent && roleBasedContent.length > 0 ? roleBasedContent[0] : initialContent)
    : initialContent;
  const loading = extractedCategoryId ? roleBasedLoading : initialLoading;
  
  // Check if current role has no content (for showing message)
  const noContentForRole = extractedCategoryId && !roleBasedLoading && roleBasedContent?.length === 0;
  
  const scrollY = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  const { headerAnimatedStyle, canvasAnimatedStyle, contentAnimatedStyle } = useEntranceAnimations();
  const { selectedAudioIndex, audioPlayer, handleAudioSelect, loadPlaylist } = useAudioPlaylist();
  const { transcripts, images, displayImage, audioFiles } = useContentPresentation(content);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Reset image index when content changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [content?.$id]);
  
  const headerBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColorOpacity = interpolate(
      scrollY.value,
      [0, 150],
      [0, 0.4],
      Extrapolate.CLAMP
    );

    return {
      backgroundColor: `rgba(0, 0, 0, ${backgroundColorOpacity})`,
    };
  });
  
  const { toggleBookmark, isBookmarked } = useBookmarkStore();
  const isCurrentlyBookmarked = content ? isBookmarked(content.$id) : false;

  const [transcriptFileNames, setTranscriptFileNames] = useState<Record<number, string>>({});

  const truncateFileName = React.useCallback((fileName: string, maxLength: number = 35): string => {
    if (fileName.length <= maxLength) {
      return fileName;
    }
    
    // Extract extension if present
    const lastDotIndex = fileName.lastIndexOf('.');
    const hasExtension = lastDotIndex > 0;
    const extension = hasExtension ? fileName.substring(lastDotIndex) : '';
    const nameWithoutExt = hasExtension ? fileName.substring(0, lastDotIndex) : fileName;
    
    // Calculate how many characters we can show (accounting for ".." and extension)
    const availableLength = maxLength - extension.length - 2; // 2 for ".."
    
    if (nameWithoutExt.length <= availableLength) {
      return fileName;
    }
    
    // Show first part + ".." + last part + extension
    const firstPartLength = Math.floor(availableLength / 2);
    const lastPartLength = availableLength - firstPartLength;
    const firstPart = nameWithoutExt.substring(0, firstPartLength);
    const lastPart = nameWithoutExt.substring(nameWithoutExt.length - lastPartLength);
    
    return `${firstPart}..${lastPart}${extension}`;
  }, []);

  React.useEffect(() => {
    if (transcripts.length > 0) {
      const fetchFileNames = async () => {
        const names: Record<number, string> = {};
        await Promise.all(
          transcripts.map(async (transcriptUrl, index) => {
            try {
              const fileName = await storageService.getFileName(transcriptUrl);
              names[index] = fileName;
            } catch {
              names[index] = `Transcript ${index + 1}`;
            }
          })
        );
        setTranscriptFileNames(names);
      };
      fetchFileNames();
    }
  }, [transcripts]);

  const handleTranscriptDownload = React.useCallback(async (transcriptUrl: string) => {
    if (!transcriptUrl) {
      Alert.alert('No File', 'No transcript file available for download.');
      return;
    }

    try {
      await storageService.downloadFile(transcriptUrl);
    } catch (error) {
      console.error('Failed to download transcript file:', error);
    }
  }, []);

  const audioFilesRef = React.useRef<string[]>([]);
  React.useEffect(() => {
    const hasChanged = audioFiles.length !== audioFilesRef.current.length || 
                       audioFiles.some((file, idx) => file !== audioFilesRef.current[idx]);
    
    if (hasChanged && audioFiles.length > 0) {
      audioFilesRef.current = audioFiles;
      loadPlaylist(audioFiles);
    }
  }, [audioFiles, loadPlaylist]);

  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/gradient.png'));
  const suggestionFont = useFont(Roboto_400Regular, 14);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleButtonPress = (buttonId: 'recovery' | 'support') => {
    setActiveButton(buttonId);
  };

  const tabSwitcher = useTabSwitcher({
    tabs: ['Recovery', 'Support'],
    activeTab: activeButton === 'recovery' ? 'Recovery' : 'Support',
    onTabChange: (tab) => {
      const newButton = tab.toLowerCase() as 'recovery' | 'support';
      handleButtonPress(newButton);
    },
    y: 100,
    enabled: !!extractedCategoryId,
  });

  const handleBookmarkToggle = () => {
    if (!content) return;
    toggleBookmark(content.$id, content.title || temptationTitle, content.role);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LoadingSpinner />
      </View>
    );
  }

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
      <View style={styles.backgroundContainer}>
        <Canvas style={styles.backgroundCanvas}>
          <SkiaImage image={bg} x={0} y={0} width={width} height={300} fit="cover" />
        </Canvas>
      </View>

      <Animated.View style={[styles.headerBackground, headerBackgroundStyle]}>
        <Animated.View style={[styles.header, { paddingTop: insets.top }, headerAnimatedStyle]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nevermore</Text>
          <View style={styles.headerSpacer} />
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={[styles.content, contentAnimatedStyle]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      >
        {extractedCategoryId && (
          <Animated.View style={[styles.canvasContainer, canvasAnimatedStyle]}>
            <Canvas style={styles.canvas}>
              {suggestionFont && (
                <>
                  <SkiaText
                    x={(width - suggestionFont.getTextWidth('We suggest beginning with Recovery and then moving')) / 2 - 5}
                    y={50}
                    text="We suggest beginning with Recovery and then moving"
                    font={suggestionFont}
                    color="white"
                  />
                  <SkiaText
                    x={(width - suggestionFont.getTextWidth('to Support whenever you feel ready.')) / 2 - 5}
                    y={70}
                    text="to Support whenever you feel ready."
                    font={suggestionFont}
                    color="white"
                  />
                </>
              )}
              {tabSwitcher.containerElement}
              {tabSwitcher.indicatorElement}
              {tabSwitcher.textElements}
            </Canvas>
            {tabSwitcher.touchableElements}
          </Animated.View>
        )}

        {noContentForRole && (
          <View style={styles.noContentMessage}>
            <Text style={styles.noContentText}>
              No {activeButton === 'recovery' ? 'Recovery' : 'Support'} content available for this category.
            </Text>
          </View>
        )}

        <View style={styles.mainTitleContainer}>
          <Text style={styles.mainTitle}>{content.title}</Text>
          <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmarkToggle}>
            {isCurrentlyBookmarked ? (
              <BookmarkActiveIcon width={18} height={20} color="#965CDF" />
            ) : (
              <BookmarkIcon width={18} height={20} />
            )}
          </TouchableOpacity>
        </View>

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

        {images.length > 0 && (
          <View style={styles.imageContainer}>
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              onMomentumScrollEnd={(event) => {
                const imageWidth = width - 40; // Account for padding (20px each side)
                const index = Math.round(event.nativeEvent.contentOffset.x / imageWidth);
                setCurrentImageIndex(index);
              }}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.imagePlaceholder} />
              )}
              contentContainerStyle={styles.imageListContainer}
            />
            {images.length > 1 && (
              <View style={styles.paginationContainer}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {transcripts.length > 0 && (
          <View style={styles.transcriptSection}>
            <View style={styles.transcriptHeader}>
              <Text style={styles.sectionTitle}>Transcripts</Text>
            </View>
            <FlatList
              data={transcripts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item: transcriptUrl, index }) => (
                <TouchableOpacity 
                  style={styles.transcriptActions} 
                  onPress={() => handleTranscriptDownload(transcriptUrl)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.transcriptText} numberOfLines={1}>
                    {truncateFileName(transcriptFileNames[index] || `Transcript ${index + 1}`)}
                  </Text>
                  <TouchableOpacity 
                    style={styles.downloadButton} 
                    onPress={() => handleTranscriptDownload(transcriptUrl)}
                    activeOpacity={0.7}
                  >
                    <DocumentIcon color="#8B5CF6" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.transcriptContainer}
              scrollEnabled={false}
            />
          </View>
        )}

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
                  questionNumber={index + 1}
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
  noContentMessage: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  noContentText: {
    color: '#A78BFA',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    marginTop: 90,
  },
  canvas: {
    width: '100%',
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
  imageContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  imageListContainer: {
    paddingHorizontal: 0,
  },
  imagePlaceholder: {
    width: Dimensions.get('window').width - 40,
    height: 200,
    resizeMode: 'cover',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginRight: 0,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationDotActive: {
    backgroundColor: '#8B5CF6',
    width: 24,
  },
  transcriptSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transcriptContainer: {
    marginTop: 0,
  },
  transcriptActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 60,
  },
  downloadButton: {
    padding: 4,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    paddingHorizontal: 20,
  },
  reflectionContainer: {
    marginTop: 15,
  },
});
