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
import { useSharedValue, withTiming, useDerivedValue, runOnJS } from 'react-native-reanimated';
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

  // Animation setup for tab indicator using Reanimated
  const indicatorPosition = useSharedValue(60); // Start at Recovery position
  const [skiaIndicatorPosition, setSkiaIndicatorPosition] = useState(60);
  
  // Create a derived value that updates the Skia position
  const animatedPosition = useDerivedValue(() => {
    'worklet';
    runOnJS(setSkiaIndicatorPosition)(indicatorPosition.value);
    return indicatorPosition.value;
  });
  
  useEffect(() => {
    const targetPosition = activeButton === 'recovery' ? 60 : width - 180;
    indicatorPosition.value = withTiming(targetPosition, { duration: 300 });
  }, [activeButton, width, indicatorPosition]);

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    // Handle navigation to other tabs here
  };

  const handleButtonPress = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.menuButton}>
          <MenuIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nevermore</Text>
        <View style={styles.headerRight} />
      </View>

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

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.recoveryButton}
        onPress={() => handleButtonPress('recovery')}
      />

      <TouchableOpacity
        style={styles.supportButton}
        onPress={() => handleButtonPress('support')}
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

