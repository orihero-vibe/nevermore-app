import { Assets as NavigationAssets } from '@react-navigation/elements';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold, Cinzel_900Black,  } from '@expo-google-fonts/cinzel';
import { useFonts as useRobotoFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Navigation } from './navigation';
import { CustomSplashScreen } from './components/CustomSplashScreen';

Asset.loadAsync([
  ...NavigationAssets,
  require('./assets/newspaper.png'),
  require('./assets/bell.png'),
  require('./assets/splash-bg.png'),
]);

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
    Roboto_700Bold,
  });
  const [showSplash, setShowSplash] = React.useState(true);

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  React.useEffect(() => {
    if (cinzelFontsLoaded && robotoFontsLoaded) {
      // Show splash screen for at least 3 seconds
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [cinzelFontsLoaded, robotoFontsLoaded]);

  if (!cinzelFontsLoaded || !robotoFontsLoaded || showSplash) {
    return <CustomSplashScreen />;
  }

  return (
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
  );
}
