import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BackdropFilter,
  Blur,
  Canvas,
  Image,
  Rect,
  rrect,
  Text as SkiaText,
  useFont,
  useImage,
} from '@shopify/react-native-skia';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  useDerivedValue, 
  runOnJS 
} from 'react-native-reanimated';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Cinzel_400Regular } from '@expo-google-fonts/cinzel';
import MenuIcon from '../../assets/icons/menu';

export function Bookmark() {
  const [activeTab, setActiveTab] = useState('bookmark');
  const [activeButton, setActiveButton] = useState('recovery');
  
  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/main-bg.png'));
  const bookmarkImg = useImage(require('../../assets/empty-bookmark.png'));
  const font = useFont(Roboto_400Regular, 13);
  const headerText = useFont(Cinzel_400Regular, 40);
  const cardFont = useFont(Roboto_400Regular, 16);
  const insets = useSafeAreaInsets();

  // Reanimated shared values for entrance animations
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const canvasOpacity = useSharedValue(0);
  const canvasTranslateY = useSharedValue(50);
  const tabOpacity = useSharedValue(0);
  const tabTranslateY = useSharedValue(30);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);
  const cardScale = useSharedValue(0.9);

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
      
      // Tab animation with delay
      tabOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
      tabTranslateY.value = withDelay(400, withTiming(0, { duration: 400 }));
      
      // Card animation with delay
      cardOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
      cardTranslateY.value = withDelay(600, withTiming(0, { duration: 500 }));
      cardScale.value = withDelay(600, withTiming(1, { duration: 500 }));
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

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    // Handle navigation to other tabs here
  };

  const handleButtonPress = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  // Press animation for tab buttons
  const handleTabPressIn = () => {
    // Add subtle press feedback if needed
  };

  const handleTabPressOut = () => {
    // Reset press feedback if needed
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top }, headerAnimatedStyle]}>
        <TouchableOpacity style={styles.menuButton}>
          <MenuIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nevermore</Text>
        <View style={styles.headerRight} />
      </Animated.View>

      <Animated.View style={[styles.canvasContainer, canvasAnimatedStyle]}>
        <Canvas style={styles.canvas}>
        {/* Background Image */}
        <Image image={bg} x={0} y={0} width={width} height={900} fit="cover" />

        {/* Main Title */}
        <SkiaText
          text="BOOKMARK"
          font={headerText}
          color="white"
          x={width / 2 - 100}
          y={150}
        />

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

        {/* Glassmorphic Card */}
        <BackdropFilter
          filter={<Blur blur={5} />}
          clip={rrect({ x: 30, y: 290, width: width - 60, height: 200 }, 12, 12)}
        >
          <Rect
            x={30}
            y={290}
            width={width - 60}
            height={200}
            color="rgba(255,255,255,0.1)"
          />
          {/* Card Text */}
          <SkiaText
            x={width / 2 - 120}
            y={340}
            text="Bookmark your favorite temptations."
            font={cardFont}
            color="white"
          />
          <SkiaText
            x={width / 2 - 100}
            y={360}
            text="We'll save them here for you."
            font={cardFont}
            color="white"
          />
          {/* Bookmark Icon */}
          <Image
            image={bookmarkImg}
            x={width / 2 - 30}
            y={380}
            width={60}
            height={60}
            fit="contain"
          />
        </BackdropFilter>
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
});

