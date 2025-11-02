import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
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
  useAnimatedScrollHandler,
  runOnJS,
  useDerivedValue
} from 'react-native-reanimated';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Cinzel_400Regular } from '@expo-google-fonts/cinzel';
import MenuIcon from '../../assets/icons/menu';
import BookmarkActiveIcon from '../../assets/icons/bookmark-active';
import { useTabSwitcher } from '../../hooks/useTabSwitcher';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { ScreenNames } from '../../constants/ScreenNames';

type RootStackParamList = {
  TemptationDetails: {
    temptationTitle: string;
  };
};

type BookmarkNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

export function Bookmark() {
  const navigation = useNavigation<BookmarkNavigationProp>();
  const [activeTab, setActiveTab] = useState('bookmark');
  const [activeButton, setActiveButton] = useState('recovery');
  
  // Get bookmarks from store
  const { bookmarks, toggleBookmark } = useBookmarkStore();
  
  const bg = useImage(require('../../assets/main-bg.png'));
  const bookmarkImg = useImage(require('../../assets/empty-bookmark.png'));
  const font = useFont(Roboto_400Regular, 13);
  const headerText = useFont(Cinzel_400Regular, 40);
  const cardFont = useFont(Cinzel_400Regular, 14);
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
  
  // Scroll-driven animation values
  const scrollY = useSharedValue(0);
  
  // Derive tab Y position from scroll - smooth animation
  const tabYPositionAnimated = useDerivedValue(() => {
    // Start at 200, move up to 140 (60px up) as we scroll
    const targetY = Math.max(140, 200 - scrollY.value * 0.75);
    return targetY;
  });
  
  // Update state for Skia rendering (Skia needs actual values, not shared values)
  useDerivedValue(() => {
    return tabYPositionAnimated.value;
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
      height: 260,
      transform: [{ translateY: canvasTranslateY.value }],
    };
  });

  // Animated style for title based on scroll
  const titleAnimatedStyle = useAnimatedStyle(() => {
    // Fade out and shrink over 80 pixels of scroll
    const opacity = 1 - (scrollY.value / 80);
    const scale = 1 - (scrollY.value / 200);
    const translateY = -(scrollY.value / 2);
    
    return {
      opacity: Math.max(0, opacity),
      transform: [
        { scale: Math.max(0.5, scale) },
        { translateY },
      ],
    };
});

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    // Handle navigation to other tabs here
  };

  const handleButtonPress = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  // Use the tab switcher hook
  const tabSwitcher = useTabSwitcher({
    tabs: ['Recovery', 'Support'],
    activeTab: activeButton === 'recovery' ? 'Recovery' : 'Support',
    onTabChange: (tab) => handleButtonPress(tab.toLowerCase()),
    y: tabYPositionAnimated.value,
  });

  const handleBookmarkPress = (bookmark: any) => {
    navigation.navigate(ScreenNames.TEMPTATION_DETAILS, {
      temptationTitle: bookmark.title,
    });
  };

  const handleRemoveBookmark = (bookmarkId: string, title: string) => {
    toggleBookmark(bookmarkId, title);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Fixed Canvas at Top */}
      <Animated.View style={[styles.canvasContainer, canvasAnimatedStyle]}>
        <Canvas style={styles.canvas}>
          {/* Background Image */}
          <Image image={bg} x={0} y={0} width={width} height={height} fit="cover" />

          {/* Tab Switcher Elements */}
          {tabSwitcher.containerElement}
          {tabSwitcher.indicatorElement}
          {tabSwitcher.textElements}
        </Canvas>
        
        {/* Animated Title Overlay - positioned absolutely for animation */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Animated.Text style={styles.mainTitle}>BOOKMARK</Animated.Text>
        </Animated.View>
      </Animated.View>

      {/* Tab Touchable Elements */}
      {tabSwitcher.touchableElements}

      {/* Scrollable Content Below */}
      {bookmarks.length === 0 ? (
        // Empty state
        <View style={styles.emptyContainer}>
          <ExpoImage 
            source={require('../../assets/empty-bookmark.png')} 
            style={styles.emptyImage}
            contentFit="contain"
          />
          <Text style={styles.emptyTitle}>No bookmarks yet</Text>
          <Text style={styles.emptyText}>
            Bookmark your favorite temptations.{'\n'}
            We'll save them here for you.
          </Text>
        </View>
      ) : (
        // Bookmarks ScrollView
        <Animated.ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <Canvas style={[styles.bookmarkCanvas, { height: bookmarks.length * 85 + 20 }]}>
            {/* Background for cards */}
            <Image image={bg} x={0} y={0} width={width} height={bookmarks.length * 85 + 20} fit="cover" />
            
            {/* Bookmark Cards with Real Blur Effect */}
            {bookmarks.map((bookmark, index) => {
              const top = index * 85;
              const cardHeight = 75;
              const cardWidth = width - 40;

              return (
                <BackdropFilter
                  key={bookmark.id}
                  filter={<Blur blur={5} />}
                  clip={rrect({ x: 20, y: top, width: cardWidth, height: cardHeight }, 12, 12)}
                >
                  <Rect
                    x={20}
                    y={top}
                    width={cardWidth}
                    height={cardHeight}
                    color={'rgba(255,255,255,0.1)'}
                  />
                  {/* Bookmark Title */}
                  <SkiaText
                    x={35}
                    y={top + cardHeight / 2 + 6}
                    text={bookmark.title}
                    color={'white'}
                    font={cardFont}
                  />
                </BackdropFilter>
              );
            })}
          </Canvas>

          {/* Touchable overlay for bookmarks */}
          {bookmarks.map((bookmark, index) => {
            const top = index * 85;
            return (
              <View
                key={`touch-${bookmark.id}`}
                style={[
                  styles.bookmarkTouchable,
                  { top }
                ]}
              >
                <TouchableOpacity
                  style={styles.bookmarkTouchableInner}
                  onPress={() => handleBookmarkPress(bookmark)}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bookmarkIconButton}
                  onPress={() => handleRemoveBookmark(bookmark.id, bookmark.title)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <BookmarkActiveIcon width={20} height={24} color="#965CDF" />
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.ScrollView>
      )}
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
    position: 'relative',
  },
  canvas: {
    height: 300,
  },
  titleContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '400',
    fontFamily: 'Cinzel_400Regular',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  bookmarkCanvas: {
    width: width,
  },
  bookmarkTouchable: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  bookmarkTouchableInner: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  bookmarkIconButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyImage: {
    width: 80,
    height: 80,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Cinzel_400Regular',
    marginBottom: 12,
  },
  emptyText: {
    color: '#888888',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});

