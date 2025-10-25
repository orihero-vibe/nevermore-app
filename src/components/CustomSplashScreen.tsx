import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, StatusBar } from 'react-native';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';

const { width, height } = Dimensions.get('window');

export function CustomSplashScreen() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        source={require('../assets/splash-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '80%',
  },
});
