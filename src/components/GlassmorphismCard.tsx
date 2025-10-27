import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {
  Canvas,
  Rect,
  BackdropBlur,
  LinearGradient,
  vec,
  Paint,
} from '@shopify/react-native-skia';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blurIntensity?: number;
  borderRadius?: number;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  style,
  blurIntensity = 15,
  borderRadius = 12,
}) => {
  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <Canvas style={StyleSheet.absoluteFillObject}>
        <Rect x={0} y={0} width={300} height={60}>
          <Paint>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, 1)}
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            />
          </Paint>
        </Rect>
        <BackdropBlur blur={blurIntensity} />
      </Canvas>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
});
