import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Canvas,
  Image,
  Text as SkiaText,
  useFont,
  useImage,
  Rect,
  BackdropFilter,
  Blur,
  rrect,
  Circle,
  Path,
} from '@shopify/react-native-skia';
import { Cinzel_400Regular } from '@expo-google-fonts/cinzel';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import MenuIcon from '../../assets/icons/menu';
import FlagIcon from '../../assets/icons/flag';
import PlayIcon from '../../assets/icons/play';
import VolumeIcon from '../../assets/icons/volume';
import SoundWaveIcon from '../../assets/icons/sound-wave';
import CheckmarkIcon from '../../assets/icons/checkmark';
import { useFortyDayStore } from '../../store/fortyDayStore';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.7;
const CARD_SPACING = 20;

// Memoized DayCard component for better performance
const DayCard = React.memo(({ 
  item, 
  isCurrentDay, 
  cinzelFont, 
  smallFont 
}: { 
  item: any; 
  isCurrentDay: boolean; 
  cinzelFont: any; 
  smallFont: any; 
}) => {
  const scale = isCurrentDay ? 1 : 0.9;
  const opacity = isCurrentDay ? 1 : 0.7;

  return (
    <Animated.View
      style={[
        styles.dayCardContainer,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <Canvas style={styles.dayCard}>
        <Rect
          x={0}
          y={0}
          width={CARD_WIDTH}
          height={200}
          color="rgba(60, 60, 60, 0.8)"
        />
        <BackdropFilter
          filter={<Blur blur={10} />}
          clip={rrect({ x: 0, y: 0, width: CARD_WIDTH, height: 200 }, 16, 16)}
        >
          <Rect
            x={0}
            y={0}
            width={CARD_WIDTH}
            height={200}
            color="rgba(255, 255, 255, 0.1)"
          />
        </BackdropFilter>
        
        {/* Day text */}
        <SkiaText
          text="DAY"
          font={smallFont}
          color="white"
          x={20}
          y={30}
        />
        
        {/* Day number */}
        <SkiaText
          text={item.day.toString()}
          font={cinzelFont}
          color="white"
          x={20}
          y={80}
        />
        
        {/* Completion percentage */}
        <SkiaText
          text={`Completed: ${item.completionPercentage}%`}
          font={smallFont}
          color="white"
          x={20}
          y={120}
        />
        
        {/* Play button */}
        <Circle
          cx={CARD_WIDTH - 60}
          cy={50}
          r={20}
          color="rgba(255, 255, 255, 0.2)"
        />
        
        {/* Volume icon */}
        <Circle
          cx={CARD_WIDTH - 60}
          cy={120}
          r={20}
          color="rgba(255, 255, 255, 0.2)"
        />
        
        {/* Flag icon */}
        <Circle
          cx={CARD_WIDTH - 30}
          cy={30}
          r={15}
          color="rgba(255, 255, 255, 0.2)"
        />
      </Canvas>
      
      {/* Interactive elements */}
      <TouchableOpacity
        style={[styles.iconButton, { top: 30, right: 15 }]}
        onPress={() => {/* Flag functionality */}}
      >
        <FlagIcon width={16} height={16} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.iconButton, { top: 30, right: 45 }]}
        onPress={() => {/* Play functionality */}}
      >
        <PlayIcon width={16} height={16} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.iconButton, { top: 100, right: 45 }]}
        onPress={() => {/* Volume functionality */}}
      >
        <VolumeIcon width={16} height={16} />
      </TouchableOpacity>
    </Animated.View>
  );
});

export function FortyDay() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const { currentDay, days, setCurrentDay, toggleTask } = useFortyDayStore();
  
  const bg = useImage(require('../../assets/main-bg.png'));
  const cinzelFont = useFont(Cinzel_400Regular, 40);
  const robotoFont = useFont(Roboto_400Regular, 16);
  const smallFont = useFont(Roboto_400Regular, 12);

  const currentDayData = days.find(d => d.day === currentDay);

  const scrollToDay = (day: number) => {
    if (day >= 1 && day <= 40) {
      setCurrentDay(day);
      const scrollX = (day - 1) * (CARD_WIDTH + CARD_SPACING);
      flatListRef.current?.scrollToOffset({ offset: scrollX, animated: true });
    }
  };

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const dayIndex = Math.round(scrollX / (CARD_WIDTH + CARD_SPACING));
    const newDay = Math.max(1, Math.min(40, dayIndex + 1));
    if (newDay !== currentDay) {
      setCurrentDay(newDay);
    }
  };

  const renderDayCard = ({ item }: { item: any }) => {
    const isCurrentDay = item.day === currentDay;
    return (
      <DayCard
        item={item}
        isCurrentDay={isCurrentDay}
        cinzelFont={cinzelFont}
        smallFont={smallFont}
      />
    );
  };

  const renderTaskItem = (task: any) => (
    <View key={task.id} style={styles.taskCard}>
      <View style={styles.taskContent}>
        <SoundWaveIcon width={24} height={24} />
        <View style={styles.taskText}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => toggleTask(currentDay, task.id)}
        >
          {task.completed ? (
            <View style={styles.checkboxCompleted}>
              <CheckmarkIcon width={16} height={16} color="white" />
            </View>
          ) : (
            <View style={styles.checkboxEmpty} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background */}
      <Canvas style={StyleSheet.absoluteFillObject}>
        <Image image={bg} x={0} y={0} width={screenWidth} height={900} fit="cover" />
      </Canvas>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.menuButton}>
          <MenuIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nevermore</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Journey Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.journeyTitle}>40 DAY JOURNEY</Text>
      </View>

      {/* Day Carousel */}
      <View style={styles.carouselContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => scrollToDay(currentDay - 1)}
          disabled={currentDay <= 1}
        >
          <Text style={[styles.navButtonText, { opacity: currentDay <= 1 ? 0.3 : 1 }]}>‹</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={days}
          renderItem={renderDayCard}
          keyExtractor={(item) => item.day.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: CARD_WIDTH + CARD_SPACING,
            offset: (CARD_WIDTH + CARD_SPACING) * index,
            index,
          })}
          initialScrollIndex={currentDay - 1}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={10}
          updateCellsBatchingPeriod={50}
        />

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => scrollToDay(currentDay + 1)}
          disabled={currentDay >= 40}
        >
          <Text style={[styles.navButtonText, { opacity: currentDay >= 40 ? 0.3 : 1 }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Tasks Section */}
      <View style={styles.tasksContainer}>
        <Text style={styles.tasksTitle}>Tasks for today</Text>
        {currentDayData?.tasks.map(renderTaskItem)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  titleContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 30,
  },
  journeyTitle: {
    color: '#fff',
    fontSize: 40,
    fontFamily: 'Cinzel_400Regular',
    textAlign: 'center',
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(60, 60, 60, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  carouselContent: {
    paddingHorizontal: 10,
  },
  dayCardContainer: {
    marginHorizontal: CARD_SPACING / 2,
  },
  dayCard: {
    width: CARD_WIDTH,
    height: 200,
  },
  iconButton: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tasksTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  taskCard: {
    backgroundColor: 'rgba(60, 60, 60, 0.8)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#965CDF',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskText: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  taskSubtitle: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  checkboxEmpty: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  checkboxCompleted: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#965CDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
