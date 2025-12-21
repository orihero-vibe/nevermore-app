import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BackdropFilter,
  Blur,
  Rect,
  rrect,
  Text as SkiaText,
  useFont,
  Group,
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
  enabled?: boolean;
}

export const useTabSwitcher = ({
  tabs,
  activeTab,
  onTabChange,
  y = 0,
  width: containerWidth,
  enabled = true,
}: TabSwitcherHookProps) => {
  const screenWidth = Dimensions.get('window').width;
  const width = containerWidth || screenWidth;
  const cardFont = useFont(Roboto_400Regular, 16);
  
  // Calculate tab dimensions (needed for initial position even if disabled)
  const containerStart = 60;
  const containerInnerWidth = width - 120;
  const sidePadding = 8;
  const availableWidthForTabs = containerInnerWidth - (sidePadding * 2);
  const minTabWidth = 100;
  const maxTabWidth = 120;
  const minSpacing = 12;
  const maxSpacing = 20;
  
  const totalSpacing = (tabs.length - 1) * maxSpacing;
  const availableWidth = availableWidthForTabs - totalSpacing;
  const calculatedTabWidth = Math.min(maxTabWidth, Math.floor(availableWidth / tabs.length));
  const tabWidth = Math.max(minTabWidth, calculatedTabWidth);
  
  const actualTotalWidth = tabs.length * tabWidth;
  const remainingSpace = availableWidthForTabs - actualTotalWidth;
  const spacing = tabs.length > 1 ? Math.max(minSpacing, Math.floor(remainingSpace / (tabs.length - 1))) : 0;
  
  const getTabPosition = (tabIndex: number) => {
    const totalTabsWidth = tabs.length * tabWidth + (tabs.length - 1) * spacing;
    const tabsStart = containerStart + sidePadding + (availableWidthForTabs - totalTabsWidth) / 2;
    return tabsStart + (tabIndex * (tabWidth + spacing));
  };
  
  // All hooks must be called unconditionally (Rules of Hooks)
  const initialPosition = getTabPosition(0);
  const indicatorPosition = useSharedValue(initialPosition);
  const [skiaIndicatorPosition, setSkiaIndicatorPosition] = useState(initialPosition);
  
  const animatedPosition = useDerivedValue(() => {
    'worklet';
    runOnJS(setSkiaIndicatorPosition)(indicatorPosition.value);
    return indicatorPosition.value;
  });

  useEffect(() => {
    if (!enabled || !cardFont) return;
    const activeIndex = tabs.indexOf(activeTab);
    if (activeIndex !== -1) {
      const targetPosition = getTabPosition(activeIndex);
      indicatorPosition.value = withTiming(targetPosition, { duration: 300 });
    }
  }, [activeTab, tabs, enabled, cardFont]);
  
  // Early return after all hooks are called
  if (!enabled || !cardFont) {
    return {
      containerElement: null,
      indicatorElement: null,
      textElements: [],
      touchableElements: [],
    };
  }


  // Use BackdropFilter for blur effect - Skia supports it on both iOS and Android
  const containerHeight = 40;
  const buttonHeight = 32;
  const verticalPadding = 4;
  
  const containerElement = (
    <BackdropFilter
      filter={<Blur blur={5} />}
      clip={rrect({ x: 60, y: y, width: width - 120, height: containerHeight }, 8, 8)}
    >
      <Rect
        x={60}
        y={y}
        width={width - 120}
        height={containerHeight}
        color="rgba(255,255,255,0.07)"
      />
    </BackdropFilter>
  );

  const indicatorElement = (
    <BackdropFilter
      filter={<Blur blur={5} />}
      clip={rrect({ 
        x: skiaIndicatorPosition, 
        y: y + verticalPadding, 
        width: tabWidth, 
        height: buttonHeight 
      }, 6, 6)}
    >
      <Rect
        x={skiaIndicatorPosition}
        y={y + verticalPadding}
        width={tabWidth}
        height={buttonHeight}
        color="#8B5CF6"
      />
    </BackdropFilter>
  );

  const textElements = tabs.map((tab, index) => {
    const tabX = getTabPosition(index) + tabWidth / 2 - (cardFont?.getTextWidth(tab) || 0) / 2;
    const textY = y + verticalPadding + buttonHeight / 2 + (cardFont?.getSize() || 16) / 3;
    return (
      <SkiaText
        key={tab}
        x={tabX}
        y={textY}
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
          {
            position: 'absolute',
            width: tabWidth,
            height: buttonHeight,
            borderRadius: 6,
            zIndex: 10,
          },
          {
            left: tabX,
            top: y + verticalPadding,
          }
        ]}
        onPress={() => onTabChange(tab)}
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
