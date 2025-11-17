import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useFortyDayStore } from '../../store/fortyDayStore';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import MenuIcon from '../../assets/icons/menu';
import FlagIcon from '../../assets/icons/flag';
import ChevronLeftIcon from '../../assets/icons/chevron-left';
import ChevronRightIcon from '../../assets/icons/chevron-right';
import PlayIcon from '../../assets/icons/play';
import PauseIcon from '../../assets/icons/pause';
import VolumeIcon from '../../assets/icons/volume';
import SoundWaveIcon from '../../assets/icons/sound-wave';
import CheckmarkIcon from '../../assets/icons/checkmark';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;

export const FortyDay = () => {
  const navigation = useNavigation();
  
  const { 
    currentDay, 
    days, 
    loading, 
    error, 
    setCurrentDay, 
    toggleTask, 
    loadFortyDayContent 
  } = useFortyDayStore();
  
  const carouselRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(currentDay - 1);
  
  const audioPlayer = useAudioPlayer();

  useEffect(() => {
    loadFortyDayContent();
  }, []);

  useEffect(() => {
    const currentDayData = days[activeIndex];
    if (currentDayData?.audioUrl) {
      console.log('Loading audio for day', currentDayData.day, ':', currentDayData.audioUrl);
      audioPlayer.loadAudio(currentDayData.audioUrl);
    } else {
      audioPlayer.unloadAudio();
    }
  }, [activeIndex]);

  const currentDayData = days[activeIndex];

  const handlePrevious = () => {
    if (activeIndex > 0) {
      carouselRef.current?.prev();
    }
  };

  const handleNext = () => {
    if (activeIndex < 39) {
      carouselRef.current?.next();
    }
  };

  const handleTaskToggle = (taskId: string) => {
    toggleTask(currentDayData.day, taskId);
  };

  const renderCarouselItem = ({ item }: { item: typeof days[0] }) => {
    const isCurrentItem = item.day === days[activeIndex]?.day;
    
    return (
      <View style={styles.carouselItemContainer}>
        <BlurView intensity={20} tint="dark" style={styles.card}>
          <View style={styles.cardHeader}>
            <TouchableOpacity style={styles.flagButton}>
              <FlagIcon width={20} height={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.dayLabel}>DAY</Text>
            <Text style={styles.dayNumber}>{item.day}</Text>
            <Text style={styles.completionText}>
              Completed: <Text style={styles.completionPercentage}>{item.completionPercentage}%</Text>
            </Text>
          </View>

          <View style={styles.mediaControls}>
            <TouchableOpacity 
              style={[
                styles.mediaButton,
                !item.audioUrl && styles.mediaButtonDisabled
              ]}
              onPress={() => isCurrentItem && item.audioUrl && audioPlayer.togglePlayPause()}
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
                styles.mediaButton,
                !item.audioUrl && styles.mediaButtonDisabled
              ]}
              disabled={!item.audioUrl}
            >
              <VolumeIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/main-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <MenuIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nevermore</Text>
        <View style={styles.menuButton} />
      </View>

      <Text style={styles.mainTitle}>40 DAY JOURNEY</Text>

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

      {!loading && !error && (
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
                defaultIndex={currentDay - 1}
                loop={false}
                enabled={true}
                style={styles.carousel}
              />
            </View>

            <TouchableOpacity
              style={[styles.navButton, styles.navButtonRight]}
              onPress={handleNext}
              disabled={activeIndex === 39}
            >
              <ChevronRightIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.tasksSection}>
            <Text style={styles.tasksTitle}>Tasks for today</Text>
            
            <ScrollView 
              style={styles.tasksList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tasksListContent}
            >
              {currentDayData?.tasks.map((task, index) => (
                <Pressable
                  key={task.id}
                  style={[
                    styles.taskItem,
                    task.completed && styles.taskItemCompleted,
                  ]}
                  onPress={() => handleTaskToggle(task.id)}
                >
                  <View style={styles.taskLeft}>
                    <View style={styles.soundWaveContainer}>
                      <SoundWaveIcon width={32} height={32} />
                    </View>
                    <View style={styles.taskTextContainer}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      {/* <Text style={styles.taskSubtitle}>{task.subtitle}</Text> */}
                    </View>
                  </View>

                  <View
                    style={[
                      styles.checkbox,
                      task.completed && styles.checkboxCompleted,
                    ]}
                  >
                    {task.completed && <CheckmarkIcon width={20} height={20} color="#8B5CF6" />}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 18,
    color: '#fff',
    letterSpacing: 1,
  },
  mainTitle: {
    fontFamily: 'Cinzel_600SemiBold',
    fontSize: 28,
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
    height: 300,
  },
  carouselWrapper: {
    width: CARD_WIDTH,
    height: 280,
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
    marginRight: 15,
  },
  navButtonRight: {
    marginLeft: 15,
  },
  card: {
    width: CARD_WIDTH,
    height: 260,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  flagButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  dayLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 2,
    marginBottom: 8,
  },
  dayNumber: {
    fontFamily: 'Cinzel_900Black',
    fontSize: 96,
    color: '#fff',
    lineHeight: 115,
    marginBottom: 12,
  },
  completionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
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
    gap: 12,
  },
  mediaButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaButtonDisabled: {
    opacity: 0.3,
  },
  tasksSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tasksTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  tasksList: {
    flex: 1,
  },
  tasksListContent: {
    paddingBottom: 100,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  taskItemCompleted: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  soundWaveContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  taskSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#fff',
    borderColor: '#8B5CF6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
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
