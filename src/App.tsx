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
import { ExpoImageSplashScreen } from './components/ExpoImageSplashScreen';
import { useAuthStore } from './store/authStore';

SplashScreen.preventAutoHideAsync();

export function App() {
  const colorScheme = useColorScheme();
  const prefix = React.useMemo(() => createURL('/'), []);
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
  const [authChecked, setAuthChecked] = React.useState(false);
  const { checkAuth } = useAuthStore();

  const theme = colorScheme === 'dark' ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#131313',
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#131313',
    },
  }

  React.useEffect(() => {
    Asset.loadAsync([
      ...NavigationAssets,
      require('./assets/newspaper.png'),
      require('./assets/App_Icon.png'),
      require('./assets/splash-bg.png'),
    ]).then(() => {
      setAssetsLoaded(true);
    }).catch(() => {
    });
  }, []);

  React.useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setAuthChecked(true);
    };

    if (cinzelFontsLoaded && robotoFontsLoaded && assetsLoaded) {
      initAuth();
    }
  }, [cinzelFontsLoaded, robotoFontsLoaded, assetsLoaded, checkAuth]);

  React.useEffect(() => {
    if (cinzelFontsLoaded && robotoFontsLoaded && assetsLoaded && authChecked) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        SplashScreen.hideAsync();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [cinzelFontsLoaded, robotoFontsLoaded, assetsLoaded, authChecked]);

  if (!cinzelFontsLoaded || !robotoFontsLoaded || !assetsLoaded || !authChecked || showSplash) {
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
      />
    </GestureHandlerRootView>
  );
}
