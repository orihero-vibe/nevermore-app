import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export function SimpleSplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.title}>
        Nevermore
      </Text>
      <Text style={styles.subtitle}>
        Loading...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    color: '#FFFFFF',
    fontFamily: 'Cinzel_400Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
