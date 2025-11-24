import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withSequence,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import cardBg from '../assets/card-bg.png';

interface TemptationItem {
  id: string;
  title: string;
  selected?: boolean;
}

interface TemptationBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  items: TemptationItem[];
  onItemSelect: (item: TemptationItem) => void;
  onNavigate?: (item: TemptationItem) => void;
}

const AnimatedTemptationItem: React.FC<{
  item: TemptationItem;
  onPress: (item: TemptationItem) => void;
  index: number;
}> = ({ item, onPress, index }) => {
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);
  const translateYAnim = useSharedValue(30);
  const pressScale = useSharedValue(1);
  const backgroundOpacity = useSharedValue(0);

  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 300 });
    scaleAnim.value = withTiming(1, { duration: 300 });
    translateYAnim.value = withTiming(0, { duration: 300 });
  }, [index]);

  const handlePressIn = () => {
    pressScale.value = withTiming(0.98, { duration: 100 });
    backgroundOpacity.value = withTiming(1, { duration: 200 });
  };

  const handlePressOut = () => {
    pressScale.value = withTiming(1, { duration: 100 });
    backgroundOpacity.value = withTiming(0, { duration: 200 });
  };

  const handlePress = () => {
    pressScale.value = withTiming(0.95, { duration: 50 }, () => {
      pressScale.value = withTiming(1, { duration: 100 });
    });
    
    setTimeout(() => {
      onPress(item);
    }, 100);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [
        { scale: scaleAnim.value * pressScale.value },
        { translateY: translateYAnim.value }
      ],
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.itemButton}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.unselectedItemBackground}>
          <Text style={styles.unselectedItemText}>{item.title}</Text>
        </View>
        
        <Animated.View 
          style={[styles.animatedBackground, backgroundAnimatedStyle]}
          pointerEvents="none"
        >
          <ImageBackground
            source={cardBg}
            style={styles.selectedItemBackground}
            imageStyle={styles.selectedItemImageStyle}
          >
            <Text style={styles.selectedItemText}>{item.title}</Text>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const TemptationBottomSheet: React.FC<TemptationBottomSheetProps> = ({
  isVisible,
  onClose,
  title,
  items,
  onItemSelect,
  onNavigate,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['75%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={() => {
          bottomSheetRef.current?.close();
        }}
        style={[
          props.style,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        ]}
      />
    ),
    []
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const handleItemPress = useCallback((item: TemptationItem) => {
    onItemSelect(item);
    
    setTimeout(() => {
      if (onNavigate) {
        onNavigate(item);
      }
      bottomSheetRef.current?.close();
    }, 300);
  }, [onItemSelect, onNavigate]);

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.bottomSheet}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              bottomSheetRef.current?.close();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <AnimatedTemptationItem
              key={item.id}
              item={item}
              index={index}
              onPress={handleItemPress}
            />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    zIndex: 9999,
    elevation: 9999,
  },
  bottomSheetBackground: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 1,
    borderTopColor: '#282828',
  },
  handleIndicator: {
    backgroundColor: '#666666',
    width: 40,
    height: 3,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 30,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto_400Regular',
    flex: 1,
    textTransform: 'capitalize',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'transparent',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemsContainer: {
    paddingTop: 10,
  },
  itemButton: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    height: 72,
    position: 'relative',
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  selectedItemBackground: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  selectedItemImageStyle: {
    borderRadius: 16,
  },
  selectedItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Cinzel_400Regular',
  },
  unselectedItemBackground: {
    backgroundColor: '#333333',
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  unselectedItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Cinzel_400Regular',
  },
});
