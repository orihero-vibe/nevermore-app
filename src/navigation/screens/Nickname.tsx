import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Canvas,
  Image as SkiaImage,
  useImage
} from '@shopify/react-native-skia';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import { Button } from '../../components/Button';
import { SecondaryButton } from '../../components/SecondaryButton';
import { Input } from '../../components/Input';
import { ScreenNames } from '../../constants/ScreenNames';
import { useNickname } from '../../hooks/useNickname';
import { useOnboardingStore } from '../../store/onboardingStore';

export function Nickname() {
  const navigation = useNavigation();
  const {
    nickname,
    setNickname,
    inputState,
    errorMessage,
    isLoading,
    saveNickname,
    skipNickname,
    isNextEnabled,
  } = useNickname();
  const { setCurrentStep } = useOnboardingStore();
  
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const bg = useImage(require('../../assets/gradient.png'));

  const mappedInputState = inputState === 'checking' ? 'default' : inputState;

  const handleNext = async () => {
    await saveNickname();
    setCurrentStep(ScreenNames.INVITE);
    (navigation as any).navigate(ScreenNames.INVITE);
  };

  const handleSkip = async () => {
    await skipNickname();
    setCurrentStep(ScreenNames.INVITE);
    (navigation as any).navigate(ScreenNames.INVITE);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Canvas style={styles.canvas}>
        <SkiaImage image={bg} x={0} y={0} width={width} height={height} fit="cover" />
      </Canvas>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nevermore</Text>
          <View style={styles.headerSpacer} />
        </View>

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
            state={mappedInputState}
            errorMessage={errorMessage}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? "Saving..." : "Next"}
            onPress={handleNext}
            variant="primary"
            size="medium"
            disabled={!isNextEnabled || isLoading}
            style={styles.nextButton}
          />
          <SecondaryButton
            title="Skip"
            onPress={handleSkip}
            size="medium"
            disabled={isLoading}
            style={styles.skipButton}
            textStyle={styles.skipButtonText}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  skipButtonText: {
    color: '#8b5cf6',
  },
});
