import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

type WaveformIconProps = {
  isActive?: boolean;
  isPlaying?: boolean;
};

export const WaveformIcon: React.FC<WaveformIconProps> = ({
  isActive = false,
  isPlaying = false
}) => {
  const waveformColor ='#FFFFFF';
  
  // Create static heights for consistency
  const staticHeights = React.useMemo(
    () => [12, 18, 8, 22, 14, 20, 10, 16, 24, 12, 18, 10, 20, 14, 22, 8, 18, 12, 16, 20],
    []
  );

  // Create animated values for each bar
  const animatedHeights = staticHeights.map(() => useSharedValue(1));

  useEffect(() => {
    if (isPlaying) {
      // Animate each bar with different timing and loops
      animatedHeights.forEach((height, index) => {
        height.value = withTiming(
          Math.random() * 1.5 + 0.5,
          {
            duration: 300 + Math.random() * 200,
          },
          (finished) => {
            if (finished && isPlaying) {
              // Create continuous loop by recursively animating
              const animate = () => {
                height.value = withTiming(
                  Math.random() * 1.5 + 0.5,
                  {
                    duration: 300 + Math.random() * 200,
                  },
                  (finished) => {
                    if (finished && isPlaying) {
                      animate();
                    }
                  }
                );
              };
              animate();
            }
          }
        );
      });
    } else {
      // Reset to original height when not playing
      animatedHeights.forEach((height) => {
        height.value = withTiming(1, { duration: 300 });
      });
    }
  }, [isPlaying]);

  return (
    <View style={styles.waveformContainer}>
      {staticHeights.map((baseHeight, i) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            height: baseHeight * animatedHeights[i].value,
          };
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.waveformBar,
              {
                backgroundColor: waveformColor,
                opacity: isActive ? 1 : 0.6,
              },
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 30,
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
  },
});

WaveformIcon.displayName = 'WaveformIcon';

