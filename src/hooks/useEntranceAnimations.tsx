import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

export interface EntranceAnimationConfig {
  duration?: number;
  delay?: number;
  translateYStart?: number;
  translateYEnd?: number;
}

interface UseEntranceAnimationsReturn {
  headerAnimatedStyle: any;
  canvasAnimatedStyle: any;
  contentAnimatedStyle: any;
}

/**
 * Hook to manage reusable entrance animations for screen components
 * Provides consistent animation patterns across different screens
 */
export function useEntranceAnimations(
  headerConfig: EntranceAnimationConfig = {},
  canvasConfig: EntranceAnimationConfig = {},
  contentConfig: EntranceAnimationConfig = {}
): UseEntranceAnimationsReturn {
  // Header animation defaults
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(headerConfig.translateYStart ?? -30);

  // Canvas animation defaults
  const canvasOpacity = useSharedValue(0);
  const canvasTranslateY = useSharedValue(canvasConfig.translateYStart ?? 0);

  // Content animation defaults
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(contentConfig.translateYStart ?? 30);

  // Entrance animations on mount
  useEffect(() => {
    const animateComponents = () => {
      // Header animation
      headerOpacity.value = withTiming(1, {
        duration: headerConfig.duration ?? 600,
      });
      headerTranslateY.value = withTiming(headerConfig.translateYEnd ?? 10, {
        duration: headerConfig.duration ?? 600,
      });

      // Canvas animation with delay
      canvasOpacity.value = withDelay(
        canvasConfig.delay ?? 200,
        withTiming(1, { duration: canvasConfig.duration ?? 800 })
      );
      canvasTranslateY.value = withDelay(
        canvasConfig.delay ?? 200,
        withTiming(canvasConfig.translateYEnd ?? -20, { duration: canvasConfig.duration ?? 800 })
      );

      // Content animation with delay
      contentOpacity.value = withDelay(
        contentConfig.delay ?? 400,
        withTiming(1, { duration: contentConfig.duration ?? 600 })
      );
      contentTranslateY.value = withDelay(
        contentConfig.delay ?? 400,
        withTiming(contentConfig.translateYEnd ?? 0, { duration: contentConfig.duration ?? 600 })
      );
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
      transform: [{ translateY: canvasTranslateY.value }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  return {
    headerAnimatedStyle,
    canvasAnimatedStyle,
    contentAnimatedStyle,
  };
}

