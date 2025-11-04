import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Pressable,
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
import MenuIcon from '../../assets/icons/menu';
import FlagIcon from '../../assets/icons/flag';
import ChevronLeftIcon from '../../assets/icons/chevron-left';
import ChevronRightIcon from '../../assets/icons/chevron-right';
import PlayIcon from '../../assets/icons/play';
import VolumeIcon from '../../assets/icons/volume';
import SoundWaveIcon from '../../assets/icons/sound-wave';
import CheckmarkIcon from '../../assets/icons/checkmark';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;

export const FortyDay = () => {
  const navigation = useNavigation();
  const { currentDay, days, setCurrentDay, toggleTask } = useFortyDayStore();
  const carouselRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(currentDay - 1);

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
            <TouchableOpacity style={styles.mediaButton}>
              <PlayIcon width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton}>
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

      {/* Header */}
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

      {/* Title */}
      <Text style={styles.mainTitle}>40 DAY JOURNEY</Text>

      {/* Carousel Section */}
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

      {/* Tasks Section */}
      <View style={styles.tasksSection}>
        <Text style={styles.tasksTitle}>Tasks for today</Text>
        
        <ScrollView 
          style={styles.tasksList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tasksListContent}
        >
          {currentDayData.tasks.map((task, index) => (
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
                  <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
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
    lineHeight: 96,
    marginBottom: 12,
  },
  completionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
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
    padding: 16,
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
});
