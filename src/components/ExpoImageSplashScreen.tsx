import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Image } from 'expo-image';

export function ExpoImageSplashScreen() {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={require('../assets/splash-bg.png')}
        style={styles.backgroundImage}
        contentFit="cover"
        onLoad={() => {
          setImageLoaded(true);
        }}
        onError={() => {
          setImageLoaded(false);
        }}
        transition={200}
      />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
    paddingBottom: 200,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Cinzel_400Regular',  
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
    paddingHorizontal: 20,
    width: '100%',
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
