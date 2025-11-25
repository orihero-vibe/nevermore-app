import React, { useState, useEffect } from 'react';
import { Alert, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import {
  Canvas,
  Image,
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
import { Cinzel_400Regular } from '@expo-google-fonts/cinzel';
import { BlurView } from 'expo-blur';
import MenuIcon from '../../assets/icons/menu';
import BookmarkActiveIcon from '../../assets/icons/bookmark-active';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { ScreenNames } from '../../constants/ScreenNames';
import { useTabSwitcher } from '../../hooks/useTabSwitcher';
import { Image as ExpoImage } from 'expo-image';

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
    toggleBookmark, 
    activeTab: storeActiveTab, 
    setActiveTab: setStoreActiveTab,
    getFilteredBookmarks 
  } = useBookmarkStore();

  const [activeTab, setActiveTab] = useState<'Recovery' | 'Support'>(storeActiveTab);
  
  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/main-bg.png'));
  const headerText = useFont(Cinzel_400Regular, 40);
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

  // Reset and animate on screen focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset animation values
      headerOpacity.value = 0;
      headerTranslateY.value = -30;
      canvasOpacity.value = 0;
      canvasTranslateY.value = 50;
      
      const currentBookmarks = getFilteredBookmarks(activeTab);
      if (currentBookmarks.length > 0) {
        bookmarkOpacities.value = currentBookmarks.map(() => 0);
        bookmarkScales.value = currentBookmarks.map(() => 0);
      }

      // Start animations
      headerOpacity.value = withTiming(1, { duration: 600 });
      headerTranslateY.value = withTiming(0, { duration: 600 });
      
      canvasOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
      canvasTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }));

      // Animate bookmarks
      if (currentBookmarks.length > 0) {
        currentBookmarks.forEach((_, index) => {
          const delay = 400 + (index * 150);
          bookmarkOpacities.value[index] = withDelay(delay, withTiming(1, { duration: 400 }));
          bookmarkScales.value[index] = withDelay(delay, withTiming(1, { duration: 400 }));
        });
      }

      return () => {
        // Cleanup if needed
      };
    }, [])
  );

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
              text="BOOKMARK"
              font={headerText}
              color="white"
              x={headerText ? width / 2 - (headerText.getTextWidth("BOOKMARK") / 2) : width / 2 - 100}
              y={150}
            />

            {tabSwitcher.containerElement}
            {tabSwitcher.indicatorElement}
            {tabSwitcher.textElements}
          </Canvas>
          
          {tabSwitcher.touchableElements}
        </TouchableOpacity>

        {filteredBookmarks.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <BlurView intensity={20} tint="dark" style={styles.emptyStateCard}>
              <Text style={styles.emptyStateTitle}>
                Bookmark your favourite temptations
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                We'll save them here for you
              </Text>
              <View style={styles.emptyStateIconContainer}>
                <ExpoImage 
                  source={require('../../assets/empty-bookmark.png')} 
                  style={styles.emptyImage}
                  contentFit="cover"
                />
              </View>
            </BlurView>
          </View>
        ) : (
          <FlatList
            data={filteredBookmarks}
            keyExtractor={(item) => item.id}
            style={styles.flatListContainer}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: bookmark, index }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleBookmarkPress(bookmark, index)}
                style={styles.bookmarkCardContainer}
              >
                <BlurView intensity={20} tint="dark" style={styles.bookmarkBlur}>
                  <Text style={styles.bookmarkTitle}>{bookmark.title}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveBookmark(bookmark.id, bookmark.title, index)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.bookmarkIconButton}
                  >
                    <BookmarkActiveIcon width={24} height={24} color="#965CDF" />
                  </TouchableOpacity>
                </BlurView>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
        </Animated.View>
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
  flatListContainer: {
    position: 'absolute',
    top: 240,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flatListContent: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  bookmarkCardContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 70,
  },
  bookmarkBlur: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bookmarkTitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Cinzel_400Regular',
    flex: 1,
  },
  bookmarkIconButton: {
    padding: 8,
  },
  separator: {
    height: 20,
  },
  emptyStateContainer: {
    position: 'absolute',
    top: 280,
    left: 30,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    width: 100,
    height: 120,
  },
  emptyStateCard: {
    width: '100%',
    minHeight: 200,
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptyStateSubtitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

});