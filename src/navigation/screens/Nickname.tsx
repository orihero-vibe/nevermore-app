import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import { Button } from '../../components/Button';
import { SecondaryButton } from '../../components/SecondaryButton';
import { Input } from '../../components/Input';
import { ScreenNames } from '../../constants/ScreenNames';

type InputState = 'default' | 'error' | 'success';

export function Nickname() {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [inputState, setInputState] = useState<InputState>('default');
  const [errorMessage, setErrorMessage] = useState('');

  // Simulate nickname availability check
  const checkNicknameAvailability = async (value: string) => {
    if (!value.trim()) {
      setInputState('default');
      setErrorMessage('');
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate some taken nicknames
    const takenNicknames = ['MLangston23', 'JohnDoe', 'TestUser', 'Admin'];
    
    if (takenNicknames.includes(value)) {
      setInputState('error');
      setErrorMessage('This username is already in use. Try a different nickname.');
    } else {
      setInputState('success');
      setErrorMessage('');
    }
  };

  // Debounced nickname check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (nickname.trim()) {
        checkNicknameAvailability(nickname);
      } else {
        setInputState('default');
        setErrorMessage('');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [nickname]);

  const handleNext = () => {
    if (nickname.trim() && inputState === 'success') {
      // TODO: Store nickname and navigate to next screen
      console.log('Nickname:', nickname);
      navigation.navigate(ScreenNames.INVITE);
    }
  };

  const handleSkip = () => {
    // TODO: Handle skip logic
    console.log('Skip nickname');
    navigation.navigate(ScreenNames.INVITE);
  };


  const isNextEnabled = nickname.trim() && inputState === 'success';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ImageBackground
        source={require('../../assets/splash-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeftIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nevermore</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Text style={styles.title}>WHAT SHOULD WE CALL YOU?</Text>
            
            <Input
              label="Nickname"
              placeholder="Example123"
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              state={inputState}
              errorMessage={errorMessage}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              size="medium"
              disabled={!isNextEnabled}
              style={styles.nextButton}
            />
            <SecondaryButton
              title="Skip"
              onPress={handleSkip}
              size="medium"
              style={styles.skipButton}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Cinzel_600SemiBold',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 40,
    fontFamily: 'Cinzel_600SemiBold',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nextButton: {
    marginBottom: 12,
  },
  skipButton: {
    alignItems: 'center',
  },
});
