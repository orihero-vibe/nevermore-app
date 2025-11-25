import { Cinzel_400Regular } from "@expo-google-fonts/cinzel";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import {
  Canvas,
  Image,
  useImage,
} from "@shopify/react-native-skia";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuIcon from '../../assets/icons/menu';
import ChevronDownIcon from '../../assets/icons/chevron-down';
import { TemptationBottomSheet } from '../../components/TemptationBottomSheet';
import { ScreenNames } from '../../constants/ScreenNames';
import { useCategories } from '../../hooks/useCategories';
import { useContent } from '../../hooks/useContent';
import type { Category } from '../../services/category.service';

interface TemptationItem {
  id: string;
  title: string;
  selected?: boolean;
}

type RootStackParamList = {
  TemptationDetails: {
    contentId: string;
    temptationTitle: string;
    categoryId?: string;
  };
};

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Home() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { categories, loading, error, getCategoryName } = useCategories();
  const { content: allContent, loading: contentLoading } = useContent();

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTemptation, setSelectedTemptation] = useState<string>('');
  const [categoryContent, setCategoryContent] = useState<Record<string, TemptationItem[]>>({});
  const canvasTranslateY = useSharedValue(50);
  const canvasOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const categoryScales = useSharedValue<number[]>([]);
  const categoryOpacities = useSharedValue<number[]>([]);

  useEffect(() => {
    if (allContent.length === 0 || categories.length === 0) return;

    const contentByCategory: Record<string, TemptationItem[]> = {};

    categories.forEach((category) => {
      const categoryItems = allContent
        .filter((item) => {
          const categoryId = typeof item.category === 'string' 
            ? item.category 
            : item.category?.$id;
          return categoryId === category.$id;
        })
        .map((item, index) => ({
          id: item.$id,
          title: item.title,
          selected: index === 0,
        }));

      const categoryName = getCategoryName(category);
      contentByCategory[categoryName] = categoryItems;
    });

    setCategoryContent(contentByCategory);
  }, [allContent, categories, getCategoryName]);

  const handleCategoryPress = (category: Category, index: number) => {
    categoryScales.value[index] = withTiming(0.98, { duration: 100 }, () => {
      categoryScales.value[index] = withTiming(1, { duration: 100 });
    });
    
    runOnJS(setSelectedCategory)(category);
    runOnJS(setBottomSheetVisible)(true);
  };

  const handleTemptationSelect = (item: TemptationItem) => {
    setSelectedTemptation(item.title);
    
    if (!selectedCategory) return;
    const categoryName = getCategoryName(selectedCategory);
    
    setCategoryContent(prev => ({
      ...prev,
      [categoryName]: prev[categoryName]?.map(t => 
        t.id === item.id ? { ...t, selected: true } : { ...t, selected: false }
      ) || []
    }));
  };

  const handleNavigateToDetails = (item: TemptationItem) => {
    navigation.navigate(ScreenNames.TEMPTATION_DETAILS, {
      contentId: item.id,
      temptationTitle: item.title,
      categoryId: selectedCategory?.$id || '',
    });
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  useEffect(() => {
    if (categories.length > 0) {
      categoryScales.value = categories.map(() => 1);
      categoryOpacities.value = categories.map(() => 0);
    }
  }, [categories]);

  // Reset and animate on screen focus
  useFocusEffect(
    React.useCallback(() => {
      if (categories.length === 0 || loading) return;

      // Reset animation values
      headerOpacity.value = 0;
      headerTranslateY.value = -30;
      canvasOpacity.value = 0;
      canvasTranslateY.value = 50;
      
      if (categories.length > 0) {
        categoryOpacities.value = categories.map(() => 0);
        categoryScales.value = categories.map(() => 0);
      }

      // Start animations
      headerOpacity.value = withTiming(1, { duration: 600 });
      headerTranslateY.value = withTiming(0, { duration: 600 });
      canvasOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
      canvasTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }));
      
      categories.forEach((_, index) => {
        const delay = 400 + (index * 150);
        categoryOpacities.value[index] = withDelay(delay, withTiming(1, { duration: 400 }));
        categoryScales.value[index] = withDelay(delay, withTiming(1, { duration: 400 }));
      });

      return () => {
        // Cleanup if needed
      };
    }, [categories, loading])
  );

  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/main-bg.png'));
  const insets = useSafeAreaInsets();

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

      <Animated.View style={[styles.backgroundContainer, canvasAnimatedStyle]}>
        <Canvas style={styles.backgroundCanvas}>
          <Image image={bg} x={0} y={0} width={width} height={900} fit="cover" />
        </Canvas>
      </Animated.View>

      <Animated.View 
        style={[styles.scrollContainer, canvasAnimatedStyle]}
        pointerEvents={bottomSheetVisible ? 'none' : 'auto'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!bottomSheetVisible}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>40 TEMPTATIONS</Text>
          </View>

          {categories.map((cat, i) => {
            return (
              <TouchableOpacity
                key={cat.$id}
                style={styles.categoryCard}
                activeOpacity={0.8}
                onPress={() => handleCategoryPress(cat, i)}
                disabled={bottomSheetVisible}
              >
                <BlurView experimentalBlurMethod={'none'} intensity={25} style={styles.blurContainer} tint="dark">
                  <View style={styles.cardContent}>
                    <Text style={styles.categoryText}>{getCategoryName(cat)}</Text>
                    <View style={styles.arrowButton}>
                      <ChevronDownIcon />
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      <View style={styles.bottomSheetWrapper}>
        <TemptationBottomSheet
          isVisible={bottomSheetVisible}
          onClose={handleCloseBottomSheet}
          title={selectedCategory ? getCategoryName(selectedCategory) : ''}
          items={selectedCategory ? categoryContent[getCategoryName(selectedCategory)] || [] : []}
          onItemSelect={handleTemptationSelect}
          onNavigate={handleNavigateToDetails}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundCanvas: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 150,
    paddingBottom: 40,
  },
  titleContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  titleText: {
    color: '#fff',
    fontSize: 34,
    fontFamily: 'Cinzel_400Regular',
    textAlign: 'center',
  },
  categoryCard: {
    marginBottom: 20,
    height: 70,
    overflow: 'hidden',
    borderRadius: 12,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Cinzel_400Regular',
    textTransform: 'uppercase',
    flex: 1,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    elevation: 10000,
    pointerEvents: 'box-none',
  },
});