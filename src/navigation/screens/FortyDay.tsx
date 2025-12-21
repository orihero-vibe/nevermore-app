import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { BlurView } from 'expo-blur';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withDelay,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFortyDayStore } from '../../store/fortyDayStore';
import { useFortyDayAudioPlayer } from '../../hooks/useFortyDayAudioPlayer';
import MenuIcon from '../../assets/icons/menu';
import FlagIcon from '../../assets/icons/flag';
import ChevronLeftIcon from '../../assets/icons/chevron-left';
import ChevronRightIcon from '../../assets/icons/chevron-right';
import PlayIcon from '../../assets/icons/play';
import PauseIcon from '../../assets/icons/pause';
import VolumeIcon from '../../assets/icons/volume';
import VolumeMutedIcon from '../../assets/icons/volume-muted';
import SoundWaveIcon from '../../assets/icons/sound-wave';
import CheckmarkIcon from '../../assets/icons/checkmark';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.6;

export const FortyDay = () => {
  const { raw: navigation, navigateToHelpSupport } = useAppNavigation();
  const insets = useSafeAreaInsets();
  
  const { 
    currentDay, 
    days, 
    loading, 
    error, 
    setCurrentDay, 
    toggleTask, 
    loadFortyDayContent ,
  } = useFortyDayStore();

  
  const carouselRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(() => {
    if (days.length === 0) return 0;
    return Math.max(0, Math.min(currentDay - 1, days.length - 1));
  });
  
  const audioPlayer = useFortyDayAudioPlayer();
  
  const contentTranslateY = useSharedValue(50);
  const contentOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    loadFortyDayContent();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      headerOpacity.value = 0;
      headerTranslateY.value = -30;
      contentOpacity.value = 0;
      contentTranslateY.value = 50;
      
      headerOpacity.value = withTiming(1, { duration: 600 });
      headerTranslateY.value = withTiming(0, { duration: 600 });
      
      // Animate content in - background is always visible to prevent black screen
      contentOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
      contentTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }));
    }, [])
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColorOpacity = interpolate(
      scrollY.value,
      [0, 150],
      [0, 0.4],
      Extrapolate.CLAMP
    );

    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
      backgroundColor: `rgba(0, 0, 0, ${backgroundColorOpacity})`,
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  useEffect(() => {
    if (days.length > 0) {
      const safeIndex = Math.max(0, Math.min(currentDay - 1, days.length - 1));
      if (safeIndex !== activeIndex) {
        setActiveIndex(safeIndex);
      }
    }
  }, [days.length, currentDay]);

  // Unload audio when switching days to clean up resources
  // Audio will only load when user clicks play button
  useEffect(() => {
    audioPlayer.unloadAudio();
  }, [activeIndex]);

  const currentDayData = days[activeIndex];

  const handlePrevious = () => {
    if (activeIndex > 0) {
      carouselRef.current?.prev();
    }
  };

  const handleNext = () => {
    if (activeIndex < days.length - 1) {
      carouselRef.current?.next();
    }
  };

  const handleTaskToggle = (taskId: string) => {
    toggleTask(currentDayData.day, taskId);
  };

  const handlePlayPause = async (audioUrl: string) => {
    if (audioPlayer.isLoading) {
      return; // Don't do anything if already loading
    }

    // If playing, just pause
    if (audioPlayer.isPlaying) {
      await audioPlayer.pause();
      return;
    }

    // Load and play audio in one call to avoid React state race condition
    await audioPlayer.loadAndPlay(audioUrl);
  };

  const renderCarouselItem = ({ item }: { item: typeof days[0] }) => {
    const isCurrentItem = item.day === days[activeIndex]?.day;
    
    return (
      <View style={styles.carouselItemContainer}>
        <View style={styles.card}>
          <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cardOverlay} />
          <View style={styles.cardContentWrapper}>
            <View style={styles.cardHeader}>
                              <TouchableOpacity 
                                style={styles.flagButton}
                                onPress={() => navigateToHelpSupport({ preSelectedReason: 'Inappropriate Content' })}
                              >
                                <FlagIcon width={30} height={30} />
                              </TouchableOpacity>
                            </View>

            <View style={styles.cardContent}>
              <Text style={styles.dayLabel}>{item.title}</Text>
              <Text style={styles.dayNumber}>{item.day}</Text>
              <Text style={styles.completionText}>
                Completed: <Text style={styles.completionPercentage}>{item.completionPercentage}%</Text>
              </Text>
            </View>

            <View style={styles.mediaControls}>
              {isCurrentItem && audioPlayer.isLoading ? (
                <View style={styles.mediaControlsContainer}>
                  <View style={styles.mediaIconArea}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  </View>
                  <View style={styles.mediaIconArea} />
                </View>
              ) : (
                <View style={styles.mediaControlsContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.mediaIconArea,
                      !item.audioUrl && styles.mediaIconAreaDisabled
                    ]}
                    onPress={() => isCurrentItem && item.audioUrl && handlePlayPause(item.audioUrl)}
                    disabled={!item.audioUrl}
                  >
                    {isCurrentItem && audioPlayer.isPlaying ? (
                      <PauseIcon width={20} height={20} />
                    ) : (
                      <PlayIcon width={20} height={20} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.mediaIconArea,
                      !item.audioUrl && styles.mediaIconAreaDisabled,
                      isCurrentItem && audioPlayer.isLoading && styles.mediaIconAreaDisabled
                    ]}
                    onPress={() => isCurrentItem && item.audioUrl && audioPlayer.toggleMute()}
                    disabled={!item.audioUrl || (isCurrentItem && audioPlayer.isLoading)}
                  >
                    {isCurrentItem && audioPlayer.isMuted ? (
                      <VolumeMutedIcon width={20} height={20} />
                    ) : (
                      <VolumeIcon width={20} height={20} />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { paddingTop: insets.top }, headerAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <MenuIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nevermore</Text>
        <View style={styles.headerRight} />
      </Animated.View>

      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require('../../assets/main-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      <Animated.View style={[styles.scrollContainer, contentAnimatedStyle]}>
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollViewContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
        <View style={[styles.headerSpacer, { height: insets.top + 100 }]} />
        <Text style={styles.mainTitle}>40 Day Journey</Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Loading your journey...</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadFortyDayContent}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && days.length > 0 && (
          <>
            <View style={styles.carouselContainer}>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={handlePrevious}
                disabled={activeIndex === 0}
              >
                <ChevronLeftIcon width={24} height={24} />
              </TouchableOpacity>

              <View style={styles.carouselWrapper}>
                <Carousel
                  ref={carouselRef}
                  width={CARD_WIDTH}
                  height={280}
                  data={days}
                  renderItem={renderCarouselItem}
                  onSnapToItem={(index) => {
                    setActiveIndex(index);
                    setCurrentDay(days[index].day);
                  }}
                  defaultIndex={days.length > 0 ? Math.max(0, Math.min(currentDay - 1, days.length - 1)) : 0}
                  loop={false}
                  enabled={true}
                  style={styles.carousel}
                />
              </View>

              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={handleNext}
                disabled={activeIndex >= days.length - 1}
              >
                <ChevronRightIcon width={24} height={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.tasksSection}>
              <Text style={styles.tasksTitle}>Tasks for today</Text>
              
              <View style={styles.tasksList}>
                {currentDayData?.tasks.map((task, index) => (
                  <Pressable
                    key={task.id}
                    style={styles.taskItemWrapper}
                    onPress={() => handleTaskToggle(task.id)}
                  >
                    {task.completed ? (
                      <ImageBackground
                        source={require('../../assets/card-bg.png')}
                        style={[styles.taskItem, styles.taskItemCompleted]}
                        imageStyle={styles.taskItemImageStyle}
                      >
                        <View style={styles.taskLeft}>
                          <View style={styles.soundWaveContainer}>
                            <SoundWaveIcon width={32} height={32} />
                          </View>
                          <View style={styles.taskTextContainer}>
                            <Text style={styles.taskTitle}>{task.title}</Text>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.checkbox,
                            styles.checkboxCompleted,
                          ]}
                        >
                          <CheckmarkIcon width={20} height={20} color="#FFFFFF" />
                        </View>
                      </ImageBackground>
                    ) : (
                      <View style={styles.taskItem}>
                        <View style={styles.taskLeft}>
                          <View style={styles.soundWaveContainer}>
                            <SoundWaveIcon width={32} height={32} />
                          </View>
                          <View style={styles.taskTextContainer}>
                            <Text style={styles.taskTitle}>{task.title}</Text>
                          </View>
                        </View>

                        <View style={styles.checkbox} />
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}
        </Animated.ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1000,
    elevation: 1000,
  },
  headerSpacer: {
    height: 100,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  mainTitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 30,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    minHeight: 300,
  },
  carouselWrapper: {
    width: CARD_WIDTH,
    minHeight: 280,
  },
  carousel: {
    width: CARD_WIDTH,
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  navButtonLeft: {
    marginRight: 8,
  },
  navButtonRight: {
    marginLeft: 8,
  },
  card: {
    width: CARD_WIDTH,
    minHeight: 260,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  cardContentWrapper: {
    flex: 1,
    zIndex: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  flagButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  dayLabel: {
    fontFamily: 'Cinzel_600SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  dayNumber: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 76,
    color: '#fff',
  },
  completionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 20,
  },
  completionPercentage: {
    color: '#fff',
    fontFamily: 'Roboto_700Bold',
  },
  mediaControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  mediaControlsContainer: {
    flexDirection: 'row',
    width: 100,
    height: 36,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  mediaIconArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  mediaIconAreaDisabled: {
    opacity: 0.3,
  },
  tasksSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tasksTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  tasksList: {
  },
  taskItemWrapper: {
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  taskItemCompleted: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  taskItemImageStyle: {
    borderRadius: 16,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  soundWaveContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  loadingContainer: {
    minHeight: SCREEN_HEIGHT * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 20,
  },
  errorContainer: {
    minHeight: SCREEN_HEIGHT * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 100,
  },
  errorText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#fff',
  },
});
