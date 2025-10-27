import { Roboto_400Regular } from "@expo-google-fonts/roboto";
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
import React, { useState, useEffect, useRef } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring, 
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS,
  withSequence
} from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MenuIcon from '../../assets/icons/menu';
import { Cinzel_400Regular } from "@expo-google-fonts/cinzel";
import { TemptationBottomSheet } from '../../components/TemptationBottomSheet';
import { ScreenNames } from '../../constants/ScreenNames';

interface TemptationItem {
  id: string;
  title: string;
  selected?: boolean;
}

type RootStackParamList = {
  TemptationDetails: {
    temptationTitle: string;
  };
};

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Home() {
  const navigation = useNavigation<HomeNavigationProp>();
  const categories = [
    "PHYSICAL HEALTH & MEDICAL AVOIDANCE",
    "EMOTIONAL & PSYCHOLOGICAL TRIGGERS",
    "SOCIAL & RELATIONSHIP DYNAMICS",
    "CULTURAL & SOCIETAL INFLUENCES",
    "FINANCIAL & LIFESTYLE IMPACTS",
  ];

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTemptation, setSelectedTemptation] = useState<string>('');
  
  // Reanimated shared values for canvas animations
  const canvasTranslateY = useSharedValue(50);
  const canvasOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  
  // Shared values for category card animations
  const categoryScales = useSharedValue(categories.map(() => 1));
  const categoryOpacities = useSharedValue(categories.map(() => 0));
  const [categoryTemptations, setCategoryTemptations] = useState<Record<string, TemptationItem[]>>({
    "PHYSICAL HEALTH & MEDICAL AVOIDANCE": [
      { id: '1', title: 'AVOIDING THE DOCTOR', selected: true },
      { id: '2', title: 'FEAR OF WITHDRAWAL' },
      { id: '3', title: 'RELAPSE' },
      { id: '4', title: 'SELF DIAGNOSING' },
      { id: '5', title: 'SELF MEDICATING' },
      { id: '6', title: 'SUBSTITUTING' },
    ],
    "EMOTIONAL & PSYCHOLOGICAL TRIGGERS": [
      { id: '7', title: 'STRESS EATING', selected: true },
      { id: '8', title: 'EMOTIONAL NUMBING' },
      { id: '9', title: 'ANXIETY AVOIDANCE' },
      { id: '10', title: 'DEPRESSION COPING' },
      { id: '11', title: 'ANGER MANAGEMENT' },
      { id: '12', title: 'LONELINESS' },
    ],
    "SOCIAL & RELATIONSHIP DYNAMICS": [
      { id: '13', title: 'PEER PRESSURE', selected: true },
      { id: '14', title: 'SOCIAL ANXIETY' },
      { id: '15', title: 'RELATIONSHIP CONFLICTS' },
      { id: '16', title: 'FAMILY EXPECTATIONS' },
      { id: '17', title: 'SOCIAL ISOLATION' },
      { id: '18', title: 'GROUP DYNAMICS' },
    ],
    "CULTURAL & SOCIETAL INFLUENCES": [
      { id: '19', title: 'CULTURAL NORMS', selected: true },
      { id: '20', title: 'MEDIA INFLUENCE' },
      { id: '21', title: 'SOCIAL MEDIA PRESSURE' },
      { id: '22', title: 'CELEBRATION CULTURE' },
      { id: '23', title: 'WORKPLACE CULTURE' },
      { id: '24', title: 'RELIGIOUS EXPECTATIONS' },
    ],
    "FINANCIAL & LIFESTYLE IMPACTS": [
      { id: '25', title: 'FINANCIAL STRESS', selected: true },
      { id: '26', title: 'WORK PRESSURE' },
      { id: '27', title: 'LIFESTYLE CHANGES' },
      { id: '28', title: 'ECONOMIC ANXIETY' },
      { id: '29', title: 'CONSUMER CULTURE' },
      { id: '30', title: 'SOCIAL STATUS' },
    ],
  });

  const handleCategoryPress = (category: string, index: number) => {
    // Add press animation with optimized spring
    categoryScales.value[index] = withSequence(
      withSpring(0.95, { damping: 20, stiffness: 300 }),
      withSpring(1, { damping: 20, stiffness: 300 })
    );
    
    // Use runOnJS for state updates to avoid bridge calls
    runOnJS(setSelectedCategory)(category);
    runOnJS(setBottomSheetVisible)(true);
  };

  const handleTemptationSelect = (item: TemptationItem) => {
    setSelectedTemptation(item.title);
    // Update the selected state for the item using setState
    setCategoryTemptations(prev => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].map(t => 
        t.id === item.id ? { ...t, selected: true } : { ...t, selected: false }
      )
    }));
  };

  const handleNavigateToDetails = (item: TemptationItem) => {
    navigation.navigate(ScreenNames.TEMPTATION_DETAILS, {
      temptationTitle: item.title,
    });
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  // Animate components on mount with Reanimated
  useEffect(() => {
    const animateComponents = () => {
      // Header animation
      headerOpacity.value = withTiming(1, { duration: 600 });
      headerTranslateY.value = withSpring(0, { 
        damping: 20, 
        stiffness: 100 
      });
      
      // Canvas animation with delay
      canvasOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
      canvasTranslateY.value = withDelay(200, withSpring(0, { 
        damping: 15, 
        stiffness: 80 
      }));
      
      // Staggered category animations
      categories.forEach((_, index) => {
        const delay = 400 + (index * 150);
        categoryOpacities.value[index] = withDelay(delay, withTiming(1, { duration: 400 }));
        categoryScales.value[index] = withDelay(delay, withSpring(1, { 
          damping: 15, 
          stiffness: 100 
        }));
      });
    };

    // Start animation after fonts are loaded
    const timer = setTimeout(animateComponents, 300);
    return () => clearTimeout(timer);
  }, []);

  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/main-bg.png'));
  const font = useFont(Roboto_400Regular, 13);
  const headerText = useFont(Cinzel_400Regular, 40);
  const categoryFont = useFont(Cinzel_400Regular, 12);
  const insets = useSafeAreaInsets();

  // Animated styles for header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  // Animated styles for canvas
  const canvasAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: canvasOpacity.value,
      transform: [{ translateY: canvasTranslateY.value }],
    };
  });

  return (
    <View style={[styles.container,]}>
      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top }, headerAnimatedStyle]}>
        <TouchableOpacity style={styles.menuButton}>
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
            // Calculate which category was tapped based on Y position
            const categoryIndex = Math.floor((locationY - 200) / 90);
            if (categoryIndex >= 0 && categoryIndex < categories.length) {
              handleCategoryPress(categories[categoryIndex], categoryIndex);
            }
          }}
        >
          <Canvas style={styles.canvas}>
        {/* Background Image */}
        <Image image={bg} x={0} y={0} width={width} height={900} fit="cover" />

        {/* Main Title */}
        <SkiaText
          text="40 TEMPTATIONS"
          font={headerText}
          color="white"
          x={width / 2 - 175}
          y={150}
        />

        {/* Glassmorphic Cards - Optimized rendering */}
        {categories.map((cat, i) => {
          const top = 200 + i * 90;
          const cardHeight = 70;
          const cardWidth = width - 60;
          const chevronX = 30 + cardWidth - 25;
          const chevronY = top + cardHeight / 2;

          return (
            <BackdropFilter
              key={i}
              filter={<Blur blur={5} />}
              clip={rrect({ x: 30, y: top, width: cardWidth, height: cardHeight }, 12, 12)}
              transform={[{ scale: categoryScales.value[i] }]}
            >
              <Rect
                x={30}
                y={top}
                width={cardWidth}
                height={cardHeight}
                color={`rgba(255,255,255,${0.1 * categoryOpacities.value[i]})`}
              />
              <SkiaText
                x={60}
                y={top + cardHeight / 2 + 6}
                text={cat}
                color={`rgba(255,255,255,${categoryOpacities.value[i]})`}
                font={categoryFont}
              />

              {/* Chevron Background Circle */}
              <BackdropFilter
                filter={<Blur blur={5} />}
                clip={rrect({ x: chevronX - 12, y: chevronY - 12, width: 24, height: 24 }, 12, 12)}
              >
                <Circle
                  cx={chevronX}
                  cy={chevronY}
                  r={12}
                  color={`rgba(255,255,255,${0.2 * categoryOpacities.value[i]})`}
                />
              </BackdropFilter>

              {/* Chevron Down Icon */}
              <Path
                path={`M ${chevronX - 4} ${chevronY - 2} L ${chevronX} ${chevronY + 2} L ${chevronX + 4} ${chevronY - 2}`}
                color={`rgba(255,255,255,${categoryOpacities.value[i]})`}
                style="stroke"
                strokeWidth={1.5}
              />
            </BackdropFilter>
          );
        })}
        </Canvas>
        </TouchableOpacity>
      </Animated.View>

      {/* Temptation Bottom Sheet */}
      <TemptationBottomSheet
        isVisible={bottomSheetVisible}
        onClose={handleCloseBottomSheet}
        title={selectedCategory}
        items={selectedCategory ? categoryTemptations[selectedCategory] : []}
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