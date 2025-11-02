import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BackdropFilter,
  Blur,
  Rect,
  rrect,
  Text as SkiaText,
  useFont,
} from '@shopify/react-native-skia';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useDerivedValue, 
  runOnJS 
} from 'react-native-reanimated';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';

interface TabSwitcherHookProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  y?: number;
  width?: number;
}

export const useTabSwitcher = ({
  tabs,
  activeTab,
  onTabChange,
  y = 0,
  width: containerWidth,
}: TabSwitcherHookProps) => {
  const screenWidth = Dimensions.get('window').width;
  const width = containerWidth || screenWidth;
  const cardFont = useFont(Roboto_400Regular, 16);
  
  // Animation setup for tab indicator using Reanimated
  const indicatorPosition = useSharedValue(60); // Start at first tab position
  const [skiaIndicatorPosition, setSkiaIndicatorPosition] = useState(60);
  
  // Create a derived value that updates the Skia position
  const animatedPosition = useDerivedValue(() => {
    'worklet';
    runOnJS(setSkiaIndicatorPosition)(indicatorPosition.value);
    return indicatorPosition.value;
  });

  // Calculate tab positions
  const getTabPosition = (tabIndex: number) => {
    const tabWidth = 120;
    const spacing = 20;
    const containerStart = 80;
    return containerStart + (tabIndex * (tabWidth + spacing));
  };

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeIndex = tabs.indexOf(activeTab);
    if (activeIndex !== -1) {
      const targetPosition = getTabPosition(activeIndex);
      indicatorPosition.value = withTiming(targetPosition, { duration: 300 });
    }
  }, [activeTab, tabs]);

  // Press animation for tab buttons
  const handleTabPressIn = () => {
    // Add subtle press feedback if needed
  };

  const handleTabPressOut = () => {
    // Reset press feedback if needed
  };

  // Generate Skia elements for Canvas
  const containerElement = (
    <BackdropFilter
      filter={<Blur blur={5} />}
      clip={rrect({ x: 70, y: y, width: width - 130, height: 50 }, 8, 8)}
    >
      <Rect
        x={50}
        y={y}
        width={width - 100}
        height={50}
        color="rgba(255,255,255,0.1)"
      />
    </BackdropFilter>
  );

  const indicatorElement = (
    <BackdropFilter
      filter={<Blur blur={5} />}
      clip={rrect({ 
        x: skiaIndicatorPosition, 
        y: y + 5, 
        width: 120, 
        height: 40 
      }, 6, 6)}
    >
      <Rect
        x={skiaIndicatorPosition}
        y={y + 5}
        width={120}
        height={40}
        color="#8B5CF6"
      />
    </BackdropFilter>
  );

  const textElements = tabs.map((tab, index) => {
    const tabX = getTabPosition(index) + 60 - (cardFont?.getTextWidth(tab) || 0) / 2;
    return (
      <SkiaText
        key={tab}
        x={tabX}
        y={y + 30}
        text={tab}
        font={cardFont}
        color="white"
      />
    );
  });

  const touchableElements = tabs.map((tab, index) => {
    const tabX = getTabPosition(index);
    return (
      <TouchableOpacity
        key={tab}
        style={[
          styles.tabButton,
          {
            left: tabX,
            top: y + 5,
          }
        ]}
        onPress={() => onTabChange(tab)}
        onPressIn={handleTabPressIn}
        onPressOut={handleTabPressOut}
        activeOpacity={0.8}
      />
    );
  });

  return {
    containerElement,
    indicatorElement,
    textElements,
    touchableElements,
  };
};

const styles = StyleSheet.create({
  tabButton: {
    position: 'absolute',
    width: 120,
    height: 40,
    borderRadius: 6,
    zIndex: 10,
  },
});
