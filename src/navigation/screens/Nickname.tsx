import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
    storedPurpose,
  } = useNickname();
  const { setCurrentStep } = useOnboardingStore();
  
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const bg = useImage(require('../../assets/gradient.png'));

  const mappedInputState = inputState === 'checking' ? 'default' : inputState;

  const handleNext = async () => {
    try {
      await saveNickname();
      setCurrentStep(ScreenNames.INVITE);
      (navigation as any).navigate(ScreenNames.INVITE);
    } catch (error) {
      // Error state and message are managed by useNickname.
      console.error('Failed to save nickname:', error);
    }
  };

  const handleSkip = async () => {
    await skipNickname();
    setCurrentStep(ScreenNames.INVITE);
    (navigation as any).navigate(ScreenNames.INVITE);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Canvas style={styles.canvas} pointerEvents="none">
        <SkiaImage image={bg} x={0} y={0} width={width} height={height} fit="cover" />
      </Canvas>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeftIcon />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Nevermore</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
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
              {storedPurpose === 'help-someone' && (
                <Text style={styles.supportDescription}>
                  We're really glad you're here to support someone you care about. You can listen to the 40 Temptations and follow the 40-Day Journey to understand the daily steps your loved one is taking — and how you can support them along the way.
                </Text>
              )}
            </ScrollView>

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
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
  keyboardAvoidingView: {
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
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 40,
    fontFamily: 'Cinzel_600SemiBold',
    textAlign: 'center',
  },
  supportDescription: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    marginTop: 24,
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
