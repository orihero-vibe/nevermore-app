import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChevronLeftIcon from '../../assets/icons/chevron-left';

export const TermsAndConditions: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/gradient.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon width={24} height={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nevermore</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Page Title */}
          <Text style={styles.pageTitle}>Terms & Conditions</Text>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>
              By using Nevermore, you agree to be respectful and use the app as intended to help support sobriety, either your own or someone else's. You own anything you share, but you give us permission to use it in the app to help others. This space is built on trust, so any harmful or abusive behavior will be removed.
            </Text>

            <Text style={[styles.contentText, styles.contentTextSpacing]}>
              This app does not offer medical or professional advice. If you're in crisis, please reach out to a licensed professional or support hotline. We may update these terms as the app grows, and using the app means you accept those changes. For questions, contact us at [your contact email].
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#131313',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Roboto_600SemiBold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#ffffff',
    marginBottom: 32,
    fontFamily: 'Cinzel_400Regular',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  contentContainer: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
  },
  contentTextSpacing: {
    marginTop: 20,
  },
});

export default TermsAndConditions;

