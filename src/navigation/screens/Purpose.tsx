import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Canvas,
  Image as SkiaImage,
  useImage
} from '@shopify/react-native-skia';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import CheckIcon from '../../assets/icons/check';
import { Button } from '../../components/Button';
import { ScreenNames } from '../../constants/ScreenNames';
import { usePurpose } from '../../hooks/usePurpose';

type PurposeType = 'seek-help' | 'help-someone';

export function Purpose() {
  const navigation = useNavigation();
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeType | null>(null);
  const { savePurpose } = usePurpose();
  
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const bg = useImage(require('../../assets/gradient.png'));

  const handleNext = async () => {
    if (selectedPurpose) {
      try {
        await savePurpose(selectedPurpose);
        console.log('Selected purpose:', selectedPurpose);
        
        (navigation as any).navigate(ScreenNames.NICKNAME);
      } catch (error) {
        console.error('Error saving purpose:', error);
      }
    }
  };

  const handlePurposeSelect = (purpose: PurposeType) => {
    setSelectedPurpose(purpose);
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

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
            <Text style={styles.title}>WHAT BRINGS YOU HERE?</Text>
            <Text style={styles.description}>
              Let us know if you're on your own path to sobriety, or here to support someone else on theirs. Either way, you're in the right place.
            </Text>

            <View style={styles.cardsContainer}>
              <TouchableOpacity
                style={[
                  styles.purposeCard,
                  selectedPurpose === 'seek-help' && styles.selectedCard
                ]}
                onPress={() => handlePurposeSelect('seek-help')}
              >
                <Image
                  source={require('../../assets/patient-bg.png')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <Text style={styles.cardText}>I AM HERE TO{'\n'}SEEK HELP</Text>
                {selectedPurpose === 'seek-help' && (
                  <View style={styles.checkmarkContainer}>
                    <CheckIcon color="#000000" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.purposeCard,
                  styles.purposeCardLast,
                  selectedPurpose === 'help-someone' && styles.selectedCard
                ]}
                onPress={() => handlePurposeSelect('help-someone')}
              >
                <Image
                  source={require('../../assets/coach-bg.png')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <Text style={styles.cardText}>I AM HERE TO{'\n'}HELP SOMEONE</Text>
                {selectedPurpose === 'help-someone' && (
                  <View style={styles.checkmarkContainer}>
                    <CheckIcon color="#000000" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  purposeCardLast: {
    marginBottom: 20,
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
    transform: [{ translateY: -25 }],
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'Cinzel_600SemiBold',
    textAlign: 'center',
    zIndex: 2,
    letterSpacing: 1,
    lineHeight: 30,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
