import React, { useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import {
  BackdropFilter,
  Blur,
  Canvas,
  Circle,
  Image,
  Path,
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
} from 'react-native-reanimated';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Cinzel_400Regular } from '@expo-google-fonts/cinzel';
import MenuIcon from '../../assets/icons/menu';
import BookmarkActiveIcon from '../../assets/icons/bookmark-active';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { ScreenNames } from '../../constants/ScreenNames';
import { useTabSwitcher } from '../../hooks/useTabSwitcher';

type RootStackParamList = {
  TemptationDetails: {
    contentId: string;
    temptationTitle: string;
  };
};

type BookmarkNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function Bookmark() {
  const navigation = useNavigation<BookmarkNavigationProp>();
  
  const { 
    bookmarks, 
    toggleBookmark, 
    activeTab: storeActiveTab, 
    setActiveTab: setStoreActiveTab,
    getFilteredBookmarks 
  } = useBookmarkStore();

  const [activeTab, setActiveTab] = useState<'Recovery' | 'Support'>(storeActiveTab);
  
  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/main-bg.png'));
  const font = useFont(Roboto_400Regular, 13);
  const headerText = useFont(Cinzel_400Regular, 40);
  const cardFont = useFont(Cinzel_400Regular, 12);
  const insets = useSafeAreaInsets();

  // Reanimated shared values for entrance animations
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const canvasOpacity = useSharedValue(0);
  const canvasTranslateY = useSharedValue(50);
  const bookmarkScales = useSharedValue<number[]>([]);
  const bookmarkOpacities = useSharedValue<number[]>([]);

  const tabSwitcher = useTabSwitcher({
    tabs: ['Recovery', 'Support'],
    activeTab: activeTab,
    onTabChange: (tab) => {
      const newTab = tab as 'Recovery' | 'Support';
      setActiveTab(newTab);
      setStoreActiveTab(newTab);
    },
    y: 170,
  });

  const filteredBookmarks = getFilteredBookmarks(activeTab);

  useEffect(() => {
    if (filteredBookmarks.length > 0) {
      bookmarkScales.value = filteredBookmarks.map(() => 1);
      bookmarkOpacities.value = filteredBookmarks.map(() => 0);
    }
  }, [filteredBookmarks]);

  useEffect(() => {
    const animateComponents = () => {
      headerOpacity.value = withTiming(1, { duration: 600 });
      headerTranslateY.value = withTiming(0, { duration: 600 });
      
      canvasOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
      canvasTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }));

      filteredBookmarks.forEach((_, index) => {
        const delay = 400 + (index * 150);
        bookmarkOpacities.value[index] = withDelay(delay, withTiming(1, { duration: 400 }));
        bookmarkScales.value[index] = withDelay(delay, withTiming(1, { duration: 400 }));
      });
    };

    const timer = setTimeout(animateComponents, 300);
    return () => clearTimeout(timer);
  }, [filteredBookmarks]);

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

  const handleBookmarkPress = (bookmark: any, index: number) => {
    bookmarkScales.value[index] = withTiming(0.98, { duration: 100 }, () => {
      bookmarkScales.value[index] = withTiming(1, { duration: 100 });
    });

    navigation.navigate(ScreenNames.TEMPTATION_DETAILS, {
      contentId: bookmark.id,
      temptationTitle: bookmark.title,
    });
  };

  const handleRemoveBookmark = (bookmarkId: string, title: string, index: number) => {
    bookmarkScales.value[index] = withTiming(0.98, { duration: 100 }, () => {
      bookmarkScales.value[index] = withTiming(1, { duration: 100 });
    });

    Alert.alert(
      'Are you sure you want to remove this temptation from your Bookmarks?',
      'You will need to bookmark the temptation again in order to see it appear on the Bookmark page.',
      [
        {
          text: 'Keep the Bookmark',
          style: 'cancel',
        },
        {
          text: 'Remove Bookmark',
          style: 'destructive',
          onPress: () => toggleBookmark(bookmarkId, title),
        },
      ]
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
        {bookmarks.length === 0 ? (
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
        <Animated.View style={[styles.canvasTouchable, canvasAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.canvasTouchable}
            activeOpacity={1}
            onPress={(event) => {
              const { locationY } = event.nativeEvent;
              const bookmarkIndex = Math.floor((locationY - 240) / 90);
              if (bookmarkIndex >= 0 && bookmarkIndex < filteredBookmarks.length) {
                handleBookmarkPress(filteredBookmarks[bookmarkIndex], bookmarkIndex);
              }
            }}
          >
          <Canvas style={styles.canvas}>
            <Image image={bg} x={0} y={0} width={width} height={900} fit="cover" />

            <SkiaText
              text="BOOKMARKS"
              font={headerText}
              color="white"
              x={width / 2 - 120}
              y={150}
            />

            {tabSwitcher.containerElement}
            {tabSwitcher.indicatorElement}
            {tabSwitcher.textElements}
            
            {filteredBookmarks.map((bookmark, index) => {
              const top = 240 + index * 90;
              const cardHeight = 70;
              const cardWidth = width - 60;
              const iconX = 30 + cardWidth - 25;
              const iconY = top + cardHeight / 2;

                return (
                  <BackdropFilter
                    key={bookmark.id}
                    filter={<Blur blur={5} />}
                    clip={rrect({ x: 30, y: top, width: cardWidth, height: cardHeight }, 12, 12)}
                  >
                    <Rect
                      x={30}
                      y={top}
                      width={cardWidth}
                      height={cardHeight}
                      color={'rgba(255,255,255,0.1)'}
                    />
                    <SkiaText
                      x={60}
                      y={top + cardHeight / 2 + 6}
                      text={bookmark.title}
                      color={'white'}
                      font={cardFont}
                    />

                    <BackdropFilter
                      filter={<Blur blur={5} />}
                      clip={rrect({ x: iconX - 12, y: iconY - 12, width: 24, height: 24 }, 12, 12)}
                    >
                      <Circle
                        cx={iconX}
                        cy={iconY}
                        r={12}
                        color={'rgba(150, 92, 223, 0.3)'}
                      />
                    </BackdropFilter>

                    <Path
                      path={`M ${iconX - 4} ${iconY - 6} L ${iconX - 4} ${iconY + 6} L ${iconX} ${iconY + 2} L ${iconX + 4} ${iconY + 6} L ${iconX + 4} ${iconY - 6} Z`}
                      color={'#965CDF'}
                      style="fill"
                    />
                  </BackdropFilter>
                );
              })}
          </Canvas>
          
          {tabSwitcher.touchableElements}
        </TouchableOpacity>

        {filteredBookmarks.map((bookmark, index) => {
          const top = 240 + index * 90;
          const cardHeight = 70;
          const cardWidth = width - 60;
          const iconX = 30 + cardWidth - 25;
            
            return (
              <View
                key={`touch-${bookmark.id}`}
                style={[
                  styles.bookmarkIconTouchable,
                  { 
                    top: top + cardHeight / 2 - 20,
                    right: (width - (30 + cardWidth)) + 10,
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleRemoveBookmark(bookmark.id, bookmark.title, index)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.bookmarkIconButton}
                >
                  <View style={{ width: 40, height: 40 }} />
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.View>
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
  canvasTouchable: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  bookmarkIconTouchable: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkIconButton: {
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