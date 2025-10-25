import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import CheckIcon from '../../assets/icons/check';
import { Button } from '../../components/Button';
import { ScreenNames } from '../../constants/ScreenNames';

type PurposeType = 'seek-help' | 'help-someone';

export function Purpose() {
  const navigation = useNavigation();
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeType | null>(null);

  const handleNext = () => {
    if (selectedPurpose) {
      // TODO: Store user's purpose selection and navigate to next screen
      console.log('Selected purpose:', selectedPurpose);
      // Navigate to nickname screen
      navigation.navigate(ScreenNames.NICKNAME);
    }
  };

  const handlePurposeSelect = (purpose: PurposeType) => {
    setSelectedPurpose(purpose);
  };

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
            <Text style={styles.title}>WHAT BRINGS YOU HERE?</Text>
            <Text style={styles.description}>
              Let us know if you're on your own path to sobriety, or here to support someone else on theirs. Either way, you're in the right place.
            </Text>

            {/* Purpose Selection Cards */}
            <View style={styles.cardsContainer}>
              {/* Seek Help Card */}
              <TouchableOpacity
                style={[
                  styles.purposeCard,
                  selectedPurpose === 'seek-help' && styles.selectedCard
                ]}
                onPress={() => handlePurposeSelect('seek-help')}
              >
                <Image
                  source={require('../../assets/purpose1.png')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                {selectedPurpose === 'seek-help' && (
                  <View style={styles.checkmarkContainer}>
                    <CheckIcon />
                  </View>
                )}
              </TouchableOpacity>

              {/* Help Someone Card */}
              <TouchableOpacity
                style={[
                  styles.purposeCard,
                  selectedPurpose === 'help-someone' && styles.selectedCard
                ]}
                onPress={() => handlePurposeSelect('help-someone')}
              >
                <Image
                  source={require('../../assets/purpose2.png')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                {selectedPurpose === 'help-someone' && (
                  <View style={styles.checkmarkContainer}>
                    <CheckIcon />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              size="medium"
              disabled={!selectedPurpose}
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
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 16,
    fontFamily: 'Cinzel_600SemiBold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  cardsContainer: {
    flex: 1,
    gap: 20,
  },
  purposeCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#8b5cf6',
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  cardText: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -20 }],
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Roboto_700Bold',
    textAlign: 'center',
    zIndex: 2,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
