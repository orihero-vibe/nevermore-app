import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface PulseAnimationProps {
  children: React.ReactNode;
  duration?: number;
  scale?: number;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({ 
  children, 
  duration = 1000,
  scale = 1.05
}) => {
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(scale, { duration: duration / 2 }),
      -1,
      true
    );
  }, [duration, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
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
