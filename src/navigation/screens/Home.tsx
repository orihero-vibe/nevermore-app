import { Cinzel_400Regular } from "@expo-google-fonts/cinzel";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
} from "@shopify/react-native-skia";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuIcon from '../../assets/icons/menu';
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

  useEffect(() => {
    if (categories.length === 0 || loading) return;

    const animateComponents = () => {
      headerOpacity.value = withTiming(1, { duration: 600 });
      headerTranslateY.value = withTiming(0, { duration: 600 });
      canvasOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
      canvasTranslateY.value = withDelay(200, withTiming(0, { duration: 800 }));
      
      categories.forEach((_, index) => {
        const delay = 400 + (index * 150);
        categoryOpacities.value[index] = withDelay(delay, withTiming(1, { duration: 400 }));
        categoryScales.value[index] = withDelay(delay, withTiming(1, { duration: 400 }));
      });
    };

    const timer = setTimeout(animateComponents, 300);
    return () => clearTimeout(timer);
  }, [categories, loading]);

  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/main-bg.png'));
  const font = useFont(Roboto_400Regular, 13);
  const headerText = useFont(Cinzel_400Regular, 40);
  const categoryFont = useFont(Cinzel_400Regular, 12);
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

      <Animated.View style={[styles.canvasTouchable, canvasAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.canvasTouchable}
          activeOpacity={1}
          onPress={(event) => {
            const { locationY } = event.nativeEvent;
            const categoryIndex = Math.floor((locationY - 200) / 90);
            if (categoryIndex >= 0 && categoryIndex < categories.length) {
              handleCategoryPress(categories[categoryIndex], categoryIndex);
            }
          }}
        >
          <Canvas style={styles.canvas}>
            <Image image={bg} x={0} y={0} width={width} height={900} fit="cover" />

            <SkiaText
              text="40 TEMPTATIONS"
              font={headerText}
              color="white"
              x={width / 2 - 175}
              y={150}
            />

            {categories.map((cat, i) => {
              const top = 200 + i * 90;
              const cardHeight = 70;
              const cardWidth = width - 60;
              const chevronX = 30 + cardWidth - 25;
              const chevronY = top + cardHeight / 2;

              return (
                <BackdropFilter
                  key={cat.$id}
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
                    text={getCategoryName(cat)}
                    color={'white'}
                    font={categoryFont}
                  />

                  <BackdropFilter
                    filter={<Blur blur={5} />}
                    clip={rrect({ x: chevronX - 12, y: chevronY - 12, width: 24, height: 24 }, 12, 12)}
                  >
                    <Circle
                      cx={chevronX}
                      cy={chevronY}
                      r={12}
                      color={'rgba(255,255,255,0.2)'}
                    />
                  </BackdropFilter>

                  <Path
                    path={`M ${chevronX - 4} ${chevronY - 2} L ${chevronX} ${chevronY + 2} L ${chevronX + 4} ${chevronY - 2}`}
                    color={'white'}
                    style="stroke"
                    strokeWidth={1.5}
                  />
                </BackdropFilter>
              );
            })}
          </Canvas>
        </TouchableOpacity>
      </Animated.View>

      <TemptationBottomSheet
        isVisible={bottomSheetVisible}
        onClose={handleCloseBottomSheet}
        title={selectedCategory ? getCategoryName(selectedCategory) : ''}
        items={selectedCategory ? categoryContent[getCategoryName(selectedCategory)] || [] : []}
        onItemSelect={handleTemptationSelect}
        onNavigate={handleNavigateToDetails}
      />
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
  canvasTouchable: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  categoryContainer: {
    position: 'absolute',
    left: 30,
  },
});