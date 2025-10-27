import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withDelay,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface FadeInAnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export const FadeInAnimation: React.FC<FadeInAnimationProps> = ({ 
  children, 
  delay = 0,
  duration = 600,
  direction = 'up',
  distance = 30
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(direction === 'up' ? distance : direction === 'down' ? -distance : 0);
  const translateX = useSharedValue(direction === 'left' ? distance : direction === 'right' ? -distance : 0);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    
    if (direction === 'up' || direction === 'down') {
      translateY.value = withDelay(delay, withTiming(0, { duration }));
    } else if (direction === 'left' || direction === 'right') {
      translateX.value = withDelay(delay, withTiming(0, { duration }));
    }
  }, [delay, duration, direction, distance]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value }
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container styles if needed
  },
});
