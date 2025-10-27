import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface AnimatedTabBarProps extends BottomTabBarProps {
  // Additional props if needed
}

export const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  const tabWidth = useSharedValue(0);
  const tabPosition = useSharedValue(0);

  React.useEffect(() => {
    const currentIndex = state.index;
    tabPosition.value = withSpring(currentIndex, {
      damping: 15,
      stiffness: 100,
    });
  }, [state.index]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      tabPosition.value,
      [0, 1, 2],
      [0, tabWidth.value, tabWidth.value * 2],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Animated indicator */}
      <Animated.View 
        style={[styles.indicator, animatedIndicatorStyle]} 
        onLayout={(event) => {
          tabWidth.value = event.nativeEvent.layout.width / state.routes.length;
        }}
      />
      
      {/* Tab buttons */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const Icon = options.tabBarIcon;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            {Icon && (
              <Icon
                color={isFocused ? '#8B5CF6' : '#9CA3AF'}
                size={24}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#131313',
    height: 100,
    paddingBottom: 12,
    paddingTop: 12,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 12,
    height: 4,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
    width: '33.33%', // For 3 tabs
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});
