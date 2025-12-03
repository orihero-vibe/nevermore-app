import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenNames } from '../../constants/ScreenNames';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useMagicURL } from '../../hooks/useMagicURL';
import { useAppNavigation } from '../../hooks/useAppNavigation';

type RootStackParamList = {
  [ScreenNames.MAGIC_URL_VERIFY]: {
    userId?: string;
    secret?: string;
  };
  [ScreenNames.HOME_TABS]: undefined;
  [ScreenNames.SIGN_IN]: undefined;
};

type MagicURLVerifyRouteProp = RouteProp<RootStackParamList, ScreenNames.MAGIC_URL_VERIFY>;
type MagicURLVerifyNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function MagicURLVerify() {
  const navigation = useNavigation<MagicURLVerifyNavigationProp>();
  const route = useRoute<MagicURLVerifyRouteProp>();
  const { navigateToHome, navigateToSignIn } = useAppNavigation();
  const { handleCreateSession, isLoading } = useMagicURL();
  
  const [errorMessage, setErrorMessage] = useState('');

  const userId = route.params?.userId;
  const secret = route.params?.secret;

  useEffect(() => {
    if (userId && secret) {
      handleCreateSession(
        userId,
        secret,
        {
          onSuccess: () => {
            navigateToHome();
          },
          onError: (error) => {
            setErrorMessage(error.message);
            
            Alert.alert(
              'Verification Failed',
              error.message || 'The magic link may have expired. Please request a new one.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: ScreenNames.SIGN_IN }],
                    });
                  },
                },
              ]
            );
          },
        }
      );
    } else {
      setErrorMessage('Invalid magic URL link. Missing required parameters.');
      Alert.alert(
        'Invalid Link',
        'This magic link is invalid. Please request a new one.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigateToSignIn();
            },
          },
        ]
      );
    }
  }, [userId, secret, handleCreateSession, navigateToHome, navigateToSignIn, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ImageBackground
        source={require('../../assets/gradient.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {isLoading ? (
              <>
                <LoadingSpinner />
                <Text style={styles.loadingText}>Verifying your magic link...</Text>
              </>
            ) : errorMessage ? (
              <>
                <Text style={styles.errorTitle}>Verification Failed</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </>
            ) : (
              <>
                <LoadingSpinner />
                <Text style={styles.loadingText}>Processing...</Text>
              </>
            )}
          </View>
        </SafeAreaView>
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
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    color: '#ef4444',
    marginBottom: 16,
    fontFamily: 'Cinzel_600SemiBold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    marginTop: 8,
  },
});

