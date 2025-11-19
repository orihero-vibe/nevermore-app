import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar } from 'react-native';

export function CustomSplashScreen() {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  console.log('CustomSplashScreen rendering');
  
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        source={require('../assets/splash-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
        onLoad={() => {
          console.log('Image loaded successfully');
          setImageLoaded(true);
        }}
        onError={(error) => {
          console.log('Image error:', error);
          setImageLoaded(false);
        }}
        onLoadStart={() => console.log('Image loading started')}
        onLoadEnd={() => console.log('Image loading ended')}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            Nevermore
          </Text>
          {!imageLoaded && (
            <Text style={styles.loadingText}>
              Loading...
            </Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(45, 27, 105, 0.8)', // Semi-transparent overlay
  },
  title: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
