import { Assets as NavigationAssets } from '@react-navigation/elements';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold, Cinzel_900Black,  } from '@expo-google-fonts/cinzel';
import { useFonts as useRobotoFonts, Roboto_400Regular, Roboto_500Medium, Roboto_600SemiBold, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Navigation } from './navigation';
import { CustomSplashScreen } from './components/CustomSplashScreen';
import { SimpleSplashScreen } from './components/SimpleSplashScreen';
import { ExpoImageSplashScreen } from './components/ExpoImageSplashScreen';

SplashScreen.preventAutoHideAsync();

const prefix = createURL('/');

export function App() {
  const colorScheme = useColorScheme();
  const [cinzelFontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
    Cinzel_900Black,
  });

  const [robotoFontsLoaded] = useRobotoFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
  });
  const [showSplash, setShowSplash] = React.useState(true);
  const [assetsLoaded, setAssetsLoaded] = React.useState(false);

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  React.useEffect(() => {
    console.log('Loading assets...');
    // Load assets first
    Asset.loadAsync([
      ...NavigationAssets,
      require('./assets/newspaper.png'),
      require('./assets/bell.png'),
      require('./assets/splash-bg.png'),
    ]).then(() => {
      console.log('Assets loaded successfully');
      setAssetsLoaded(true);
    }).catch((error) => {
      console.log('Asset loading error:', error);
    });
  }, []);

  React.useEffect(() => {
    console.log('Fonts and assets status:', { cinzelFontsLoaded, robotoFontsLoaded, assetsLoaded });
    if (cinzelFontsLoaded && robotoFontsLoaded && assetsLoaded) {
      console.log('All loaded, starting timer...');
      // Show splash screen for at least 2 seconds
      const timer = setTimeout(() => {
        console.log('Hiding splash screen');
        setShowSplash(false);
        SplashScreen.hideAsync();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [cinzelFontsLoaded, robotoFontsLoaded, assetsLoaded]);

  if (!cinzelFontsLoaded || !robotoFontsLoaded || !assetsLoaded || showSplash) {
    console.log('Showing splash screen, status:', { cinzelFontsLoaded, robotoFontsLoaded, assetsLoaded, showSplash });
    return <ExpoImageSplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation
        theme={theme}
        linking={{
          enabled: 'auto',
          prefixes: [prefix],
        }}
        onReady={() => {
          SplashScreen.hideAsync();
        }}
      />
    </GestureHandlerRootView>
  );
}
